import { MatchScoreBreakdown } from '../types';

export const SKILL_NORMALIZATION_MAP: Record<string, string> = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'postgres sql': 'PostgreSQL',
  'docker': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'Amazon Web Services',
  'amazon web services': 'Amazon Web Services',
  'python': 'Python',
  'fastapi': 'FastAPI',
  'django': 'Django',
  'golang': 'Go',
  'go': 'Go',
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'java': 'Java',
  'graphql': 'GraphQL',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'sql': 'SQL',
  'git': 'Git'
};

export function normalizeSkill(skill: string): string {
  const clean = skill.trim().toLowerCase();
  return SKILL_NORMALIZATION_MAP[clean] || skill.trim();
}

export function calculateExplainableMatch(
  candidateSkills: string[],
  candidateExperienceYears: number,
  candidateEducationLevel: string,
  candidateLocation: string,
  candidateWorkMode: string,
  jobRequiredSkills: string[],
  jobPreferredSkills: string[],
  jobExperienceMin: number,
  jobEducationRequired: string,
  jobLocation: string,
  jobWorkMode: string,
  semanticCosine: number = 0.88
): MatchScoreBreakdown {
  const normCand = new Set(candidateSkills.map(normalizeSkill));
  const normReq = new Set(jobRequiredSkills.map(normalizeSkill));
  const normPref = new Set(jobPreferredSkills.map(normalizeSkill));

  // 1. Required Skills Score (Weight 40%)
  let matchedReq: string[] = [];
  let missingReq: string[] = [];
  normReq.forEach(skill => {
    if (normCand.has(skill)) {
      matchedReq.push(skill);
    } else {
      missingReq.push(skill);
    }
  });

  const requiredSkillScore = normReq.size > 0 
    ? (matchedReq.length / normReq.size) * 100 
    : 100;

  // 2. Preferred Skills Score (Weight 20%)
  let matchedPref: string[] = [];
  let missingPref: string[] = [];
  normPref.forEach(skill => {
    if (normCand.has(skill)) {
      matchedPref.push(skill);
    } else {
      missingPref.push(skill);
    }
  });

  const preferredSkillScore = normPref.size > 0 
    ? (matchedPref.length / normPref.size) * 100 
    : 100;

  // 3. Experience Score (Weight 15%)
  let experienceScore = 100;
  if (candidateExperienceYears < jobExperienceMin) {
    const diff = jobExperienceMin - candidateExperienceYears;
    experienceScore = Math.max(20, Math.round(100 - (diff * 18)));
  }

  // 4. Education Score (Weight 10%)
  const eduRank: Record<string, number> = {
    'diploma': 1,
    'bachelors': 2,
    'masters': 3,
    'phd': 4
  };
  const cRank = eduRank[candidateEducationLevel.toLowerCase()] || 2;
  const jRank = eduRank[jobEducationRequired.toLowerCase()] || 2;
  const educationScore = cRank >= jRank ? 100 : 75;

  // 5. Semantic Vector Score (Weight 10%)
  const semanticScore = Math.min(100, Math.max(0, Math.round(semanticCosine * 100)));

  // 6. Location / Work Mode Score (Weight 5%)
  let locationScore = 60;
  if (jobWorkMode === 'REMOTE' || candidateWorkMode === 'REMOTE') {
    locationScore = 100;
  } else if (
    candidateLocation.toLowerCase().includes(jobLocation.toLowerCase()) || 
    jobLocation.toLowerCase().includes(candidateLocation.toLowerCase())
  ) {
    locationScore = 100;
  } else if (candidateWorkMode === 'HYBRID' && jobWorkMode === 'HYBRID') {
    locationScore = 85;
  }

  // Final Weighted Composition
  const weights = {
    requiredSkills: 0.40,
    preferredSkills: 0.20,
    experience: 0.15,
    education: 0.10,
    semantic: 0.10,
    location: 0.05
  };

  const rawOverall = (
    (requiredSkillScore * weights.requiredSkills) +
    (preferredSkillScore * weights.preferredSkills) +
    (experienceScore * weights.experience) +
    (educationScore * weights.education) +
    (semanticScore * weights.semantic) +
    (locationScore * weights.location)
  );

  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall * 10) / 10));

  // Strengths compilation
  const strengths: string[] = [];
  if (matchedReq.length > 0) {
    strengths.push(`${matchedReq.length}/${normReq.size} required core competencies match (${matchedReq.slice(0, 3).join(', ')})`);
  }
  if (matchedPref.length > 0) {
    strengths.push(`Bonus proficiency in ${matchedPref.slice(0, 2).join(', ')}`);
  }
  if (experienceScore >= 90) {
    strengths.push(`Experience of ${candidateExperienceYears} years exceeds threshold of ${jobExperienceMin} years`);
  }
  if (locationScore === 100) {
    strengths.push(`Work arrangement (${jobWorkMode}) aligns with candidate preference`);
  }

  const allMatched = Array.from(new Set([...matchedReq, ...matchedPref]));
  const explanation = `Evaluated at ${overallScore}% fit. Found direct synergy with ${allMatched.slice(0, 3).join(', ')}. ${
    missingReq.length > 0 
      ? `Skill gaps detected in ${missingReq.slice(0, 2).join(', ')} which can be addressed via recommended learning modules.` 
      : 'All mandatory skill requirements are satisfied.'
  }`;

  return {
    overallScore,
    requiredSkillScore: Math.round(requiredSkillScore),
    preferredSkillScore: Math.round(preferredSkillScore),
    experienceScore: Math.round(experienceScore),
    educationScore: Math.round(educationScore),
    semanticScore: Math.round(semanticScore),
    locationScore: Math.round(locationScore),
    matchedSkills: allMatched,
    missingSkills: missingReq,
    strengths,
    explanation,
    weightsUsed: weights
  };
}
