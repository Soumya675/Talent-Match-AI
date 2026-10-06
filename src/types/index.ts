export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  name: string;
  avatarUrl?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  preferredWorkMode: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'FLEXIBLE';
  yearsOfExperience: number;
  educationLevel: 'bachelors' | 'masters' | 'phd' | 'diploma';
  skills: string[];
  isOpenToWork: boolean;
}

export interface ResumeData {
  id: string;
  candidateId: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  extractedText: string;
  atsScore: number;
  completenessScore: number;
  skillsScore: number;
  experienceScore: number;
  formattingScore: number;
  strengths: string[];
  recommendations: string[];
  missingKeywords: string[];
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  experienceMin: number;
  experienceMax?: number;
  educationRequired: 'bachelors' | 'masters' | 'phd' | 'diploma';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  createdAt: string;
}

export interface MatchScoreBreakdown {
  overallScore: number;
  requiredSkillScore: number;
  preferredSkillScore: number;
  experienceScore: number;
  educationScore: number;
  semanticScore: number;
  locationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  explanation: string;
  weightsUsed: {
    requiredSkills: number;
    preferredSkills: number;
    experience: number;
    education: number;
    semantic: number;
    location: number;
  };
}

export type ApplicationStatus = 
  | 'APPLIED' 
  | 'SCREENING' 
  | 'SHORTLISTED' 
  | 'INTERVIEW' 
  | 'SELECTED' 
  | 'REJECTED' 
  | 'WITHDRAWN';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateExperience: number;
  matchScore: number;
  currentStatus: ApplicationStatus;
  appliedAt: string;
  notes?: string;
  timeline: {
    status: ApplicationStatus;
    changedAt: string;
    note: string;
  }[];
}

export interface SkillGapItem {
  skill: string;
  currentLevel: 'Missing' | 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Required' | 'Preferred';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedCourse?: {
    title: string;
    provider: string;
    durationHours: number;
    url: string;
  };
}

export interface InterviewQuestion {
  id: string;
  category: 'HR' | 'TECHNICAL' | 'PROJECT' | 'SYSTEM_DESIGN';
  question: string;
  sampleAnswerHint: string;
  keyPointsToCover: string[];
}
