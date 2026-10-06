"""
Explainable AI Job Matching Engine
Deterministic 6-component weighted scoring system:
Overall Score = W_rs*S_rs + W_ps*S_ps + W_exp*S_exp + W_edu*S_edu + W_sem*S_sem + W_loc*S_loc
"""
from typing import List, Dict, Any
from app.core.config import settings

def calculate_explainable_match(
    candidate_skills: List[str],
    candidate_experience_years: float,
    candidate_education_level: str,
    candidate_location: str,
    candidate_work_mode: str,
    job_required_skills: List[str],
    job_preferred_skills: List[str],
    job_experience_min: int,
    job_experience_max: int,
    job_education_required: str,
    job_location: str,
    job_work_mode: str,
    semantic_similarity: float = 0.85
) -> Dict[str, Any]:
    # 1. Normalize skill tokens
    cand_norm = {s.strip().lower() for s in candidate_skills}
    req_norm = {s.strip().lower() for s in job_required_skills}
    pref_norm = {s.strip().lower() for s in job_preferred_skills}

    # 2. Required Skill Score
    if req_norm:
        matched_req = req_norm.intersection(cand_norm)
        missing_req = req_norm.difference(cand_norm)
        required_skill_score = (len(matched_req) / len(req_norm)) * 100
    else:
        matched_req = set()
        missing_req = set()
        required_skill_score = 100.0

    # 3. Preferred Skill Score
    if pref_norm:
        matched_pref = pref_norm.intersection(cand_norm)
        preferred_skill_score = (len(matched_pref) / len(pref_norm)) * 100
    else:
        matched_pref = set()
        preferred_skill_score = 100.0

    # 4. Experience Fit Score
    if candidate_experience_years >= job_experience_min:
        experience_score = 100.0
    else:
        # Partial credit based on ratio
        ratio = max(0.0, candidate_experience_years / max(1, job_experience_min))
        experience_score = round(ratio * 80.0, 1)

    # 5. Education Fit Score
    edu_weights = {"phd": 4, "masters": 3, "bachelors": 2, "diploma": 1, "high_school": 0}
    c_lvl = edu_weights.get(candidate_education_level.lower(), 2)
    j_lvl = edu_weights.get(job_education_required.lower(), 2)
    education_score = 100.0 if c_lvl >= j_lvl else 75.0

    # 6. Semantic Similarity Score (0 - 100 scale from embedding cosine)
    semantic_score = min(100.0, max(0.0, semantic_similarity * 100.0))

    # 7. Work Mode / Location Score
    if job_work_mode.upper() == "REMOTE" or candidate_work_mode.upper() == "REMOTE":
        location_score = 100.0
    elif candidate_location.lower() in job_location.lower() or job_location.lower() in candidate_location.lower():
        location_score = 100.0
    else:
        location_score = 60.0

    # Weighted Overall Score
    overall_score = (
        (required_skill_score * settings.WEIGHT_REQUIRED_SKILLS) +
        (preferred_skill_score * settings.WEIGHT_PREFERRED_SKILLS) +
        (experience_score * settings.WEIGHT_EXPERIENCE) +
        (education_score * settings.WEIGHT_EDUCATION) +
        (semantic_score * settings.WEIGHT_SEMANTIC_SIMILARITY) +
        (location_score * settings.WEIGHT_LOCATION)
    )
    overall_score = round(min(100.0, max(0.0, overall_score)), 1)

    # Human-readable strengths & recommendations
    strengths = []
    if len(matched_req) > 0:
        strengths.append(f"{len(matched_req)}/{len(req_norm)} required core competencies matched")
    if experience_score >= 90:
        strengths.append(f"Domain experience ({candidate_experience_years} yrs) meets or exceeds requirement ({job_experience_min} yrs)")
    if location_score == 100:
        strengths.append(f"Work arrangement ({job_work_mode}) aligns with preferences")

    missing_skills_list = [s.title() for s in missing_req]
    matched_skills_list = [s.title() for s in matched_req.union(matched_pref)]

    explanation = (
        f"Overall match of {overall_score}%. Strong alignment in "
        f"{', '.join(matched_skills_list[:3]) if matched_skills_list else 'general experience'}."
    )
    if missing_skills_list:
        explanation += f" Consider building proficiency in {', '.join(missing_skills_list[:2])} to maximize competitiveness."

    return {
        "overall_score": overall_score,
        "required_skill_score": round(required_skill_score, 1),
        "preferred_skill_score": round(preferred_skill_score, 1),
        "experience_score": round(experience_score, 1),
        "education_score": round(education_score, 1),
        "semantic_score": round(semantic_score, 1),
        "location_score": round(location_score, 1),
        "matched_skills": matched_skills_list,
        "missing_skills": missing_skills_list,
        "strengths": strengths,
        "explanation": explanation
    }
