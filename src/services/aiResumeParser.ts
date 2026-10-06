import { ResumeData } from '../types';

export function parseAndScoreResumeLocally(rawText: string, fileName: string = 'Resume.pdf'): ResumeData {
  const lower = rawText.toLowerCase();

  // 1. Skill Extraction
  const recognizedSkills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'FastAPI', 'Django',
    'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services', 'Tailwind CSS',
    'Redis', 'Git', 'SQL', 'MongoDB', 'Go', 'GraphQL', 'REST APIs', 'CI/CD', 'Terraform',
    'Linux', 'Next.js', 'Redux', 'System Design'
  ];

  const extractedSkills = recognizedSkills.filter(skill => {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return pattern.test(lower);
  });

  // 2. Measurable Outcomes & Action Verbs Check
  const metricPattern = /(\d+%\b|\$\d+|\b\d+\s*(?:million|m|k|users|requests|ms|seconds|minutes|days|hours)\b)/gi;
  const metricsFound = (rawText.match(metricPattern) || []).length;

  const actionVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'reduced', 'boosted', 'scaled', 'implemented', 'designed', 'built'];
  const actionVerbsFound = actionVerbs.filter(verb => lower.includes(verb)).length;

  // 3. Category Scoring
  // Profile Completeness (Contact info, Summary, Education, Experience)
  let completeness = 40;
  if (lower.includes('@')) completeness += 15;
  if (/\b\d{3}[-.)\s]*/.test(lower)) completeness += 15;
  if (lower.includes('education') || lower.includes('degree') || lower.includes('bachelor') || lower.includes('master')) completeness += 15;
  if (lower.includes('experience') || lower.includes('work history')) completeness += 15;
  completeness = Math.min(100, completeness);

  // Skills Score
  const skillsScore = Math.min(100, Math.round((extractedSkills.length / 8) * 100));

  // Experience & Metrics Score
  let experienceScore = 50;
  if (metricsFound >= 3) experienceScore += 30;
  else if (metricsFound >= 1) experienceScore += 15;
  if (actionVerbsFound >= 4) experienceScore += 20;
  experienceScore = Math.min(100, experienceScore);

  // ATS Formatting Score
  let formattingScore = 88;
  if (rawText.length > 500 && rawText.length < 5000) formattingScore += 8;
  if (lower.includes('table') || lower.includes('columns')) formattingScore -= 10;
  formattingScore = Math.min(100, formattingScore);

  // Overall ATS Score (Weighted)
  const overallAts = Math.round(
    (completeness * 0.25) +
    (skillsScore * 0.35) +
    (experienceScore * 0.25) +
    (formattingScore * 0.15)
  );

  // Actionable Recommendations
  const recommendations: string[] = [];
  const strengths: string[] = [];

  if (metricsFound >= 2) {
    strengths.push(`Includes ${metricsFound} quantified business outcomes (e.g. latency, scale, efficiency)`);
  } else {
    recommendations.push('Add measurable numerical results (e.g., "Reduced page load time by 34%", "Saved $20K/month in cloud spend")');
  }

  if (actionVerbsFound >= 3) {
    strengths.push(`Strong active vocabulary: uses executive action verbs (${actionVerbsFound} found)`);
  } else {
    recommendations.push('Replace passive phrases with strong engineering impact verbs ("Architected", "Engineered", "Benchmarked")');
  }

  if (extractedSkills.length >= 6) {
    strengths.push(`Solid technical density with ${extractedSkills.length} industry-standard competencies`);
  } else {
    recommendations.push('Include more explicit tools and technologies in a dedicated "Skills" section to boost ATS keyword indexing');
  }

  // Keywords that top tech jobs demand
  const highDemandKeywords = ['Docker', 'PostgreSQL', 'TypeScript', 'Kubernetes', 'CI/CD', 'System Design', 'Redis'];
  const missingKeywords = highDemandKeywords.filter(k => !extractedSkills.some(s => s.toLowerCase() === k.toLowerCase()));

  return {
    id: `resume-${Date.now()}`,
    candidateId: 'cand-profile-1',
    fileName,
    fileSizeBytes: rawText.length * 2,
    uploadedAt: new Date().toISOString(),
    extractedText: rawText,
    atsScore: overallAts,
    completenessScore: completeness,
    skillsScore: skillsScore,
    experienceScore: experienceScore,
    formattingScore: formattingScore,
    strengths,
    recommendations,
    missingKeywords: missingKeywords.slice(0, 4)
  };
}
