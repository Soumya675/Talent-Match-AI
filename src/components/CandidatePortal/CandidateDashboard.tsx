import React, { useState } from 'react';
import { Job, CandidateProfile, ResumeData, Application, MatchScoreBreakdown, InterviewQuestion } from '../../types';
import { calculateExplainableMatch } from '../../services/matchingEngine';
import { parseAndScoreResumeLocally } from '../../services/aiResumeParser';
import { MOCK_COURSES } from '../../services/mockData';
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  GitFork, 
  HelpCircle, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  Upload, 
  BookOpen, 
  Award, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Sliders,
  Send,
  ExternalLink,
  Info
} from 'lucide-react';

interface CandidateDashboardProps {
  candidate: CandidateProfile;
  jobs: Job[];
  applications: Application[];
  onApplyJob: (job: Job) => void;
  onUpdateResume: (newResumeText: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  candidate,
  jobs,
  applications,
  onApplyJob,
  onUpdateResume
}) => {
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'RESUME' | 'SKILL_GAP' | 'INTERVIEW' | 'APPLICATIONS'>('MATCHES');
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [matchDetailsModal, setMatchDetailsModal] = useState<{ job: Job; breakdown: MatchScoreBreakdown } | null>(null);
  
  // Resume local state
  const [resumeText, setResumeText] = useState(`ALEX RIVERA
San Francisco, CA | alex.rivera@example.com | (555) 019-2831

SUMMARY
Full-Stack Software Engineer with 5+ years of experience designing scalable microservices, responsive web architectures, and RESTful APIs using TypeScript, React, Python, and PostgreSQL.

SKILLS
• Languages: TypeScript, JavaScript, Python, SQL, Go (Beginner)
• Frontend: React, Next.js, Tailwind CSS, TanStack Query
• Backend: Node.js, Express, FastAPI, PostgreSQL, Redis, SQLAlchemy
• Cloud & DevOps: Docker, AWS, Git, CI/CD GitHub Actions

EXPERIENCE
Senior Software Engineer | FinScale Technologies (2022 - Present)
• Architected high-throughput ledger microservices in FastAPI and PostgreSQL, processing 1.2M transactions/day with sub-50ms latency.
• Redesigned customer portal in React and TypeScript, boosting core web vitals by 42% and user retention by 18%.
• Implemented automated Docker CI/CD pipelines reducing deployment lead time from 4 hours to 12 minutes.`);

  const [resumeScoreData, setResumeScoreData] = useState<ResumeData>(() => parseAndScoreResumeLocally(resumeText));
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Target job for skill gap
  const [targetJobId, setTargetJobId] = useState<string>(jobs[0]?.id || 'job-1');
  const targetJob = jobs.find(j => j.id === targetJobId) || jobs[0];

  // Interview prep category
  const [interviewCategory, setInterviewCategory] = useState<'HR' | 'TECHNICAL' | 'PROJECT' | 'SYSTEM_DESIGN'>('TECHNICAL');

  // Compute matches for all jobs
  const jobMatches = jobs.map(job => {
    const breakdown = calculateExplainableMatch(
      candidate.skills,
      candidate.yearsOfExperience,
      candidate.educationLevel,
      candidate.location,
      candidate.preferredWorkMode,
      job.requiredSkills,
      job.preferredSkills,
      job.experienceMin,
      job.educationRequired,
      job.location,
      job.workMode
    );
    return {
      job,
      breakdown,
      isApplied: applications.some(a => a.jobId === job.id)
    };
  }).sort((a, b) => b.breakdown.overallScore - a.breakdown.overallScore);

  const handleReanalyzeResume = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      const updated = parseAndScoreResumeLocally(resumeText, 'Updated_Resume.pdf');
      setResumeScoreData(updated);
      onUpdateResume(resumeText);
      setIsReanalyzing(false);
    }, 600);
  };

  // Skill gap calculation for target job
  const targetNormReq = targetJob.requiredSkills;
  const candidateNorm = new Set(candidate.skills.map(s => s.toLowerCase()));
  
  const skillGaps = targetNormReq.map(skill => {
    const hasSkill = candidateNorm.has(skill.toLowerCase());
    const course = MOCK_COURSES.find(c => c.skill.toLowerCase() === skill.toLowerCase()) || {
      title: `${skill} Professional Certification & Hands-on Lab`,
      provider: 'Coursera / Official Tech Foundation',
      durationHours: 20,
      url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' tutorials and course')}`
    };
    return {
      skill,
      status: hasSkill ? 'Covered' : 'Missing',
      priority: hasSkill ? 'LOW' : 'HIGH',
      course
    };
  });

  // Dynamic interview questions based on candidate resume and target job
  const sampleInterviewQuestions: Record<string, InterviewQuestion[]> = {
    TECHNICAL: [
      {
        id: 'q-tech-1',
        category: 'TECHNICAL',
        question: `How would you structure a low-latency database query in PostgreSQL using indexing for a table handling 1M+ transactions daily?`,
        sampleAnswerHint: `Discuss B-Tree vs GIN indexes, composite indexes, partial indexing, and connection pooling with pgBouncer.`,
        keyPointsToCover: ['Index selection', 'EXPLAIN ANALYZE', 'Read-write trade-offs']
      },
      {
        id: 'q-tech-2',
        category: 'TECHNICAL',
        question: `Can you explain the trade-offs between asynchronous microservices in FastAPI vs Node.js event loop concurrency?`,
        sampleAnswerHint: `Mention GIL in CPython vs single-threaded V8 event loop, async/await coroutines, and CPU-bound vs IO-bound workloads.`,
        keyPointsToCover: ['Event loop mechanics', 'Worker processes', 'Throughput metrics']
      },
      {
        id: 'q-tech-3',
        category: 'TECHNICAL',
        question: `How do you handle state normalization and optimistic updates in React 19 / TanStack Query?`,
        sampleAnswerHint: `Discuss query key invalidation, cache rollback on network failure, and hydration.`,
        keyPointsToCover: ['Optimistic UI', 'Error rollback', 'Cache management']
      }
    ],
    SYSTEM_DESIGN: [
      {
        id: 'q-sys-1',
        category: 'SYSTEM_DESIGN',
        question: `Design an explainable matching engine that computes similarity scores between 500,000 resumes and 20,000 active job postings in under 200ms.`,
        sampleAnswerHint: `Describe two-stage retrieval: candidate pre-filtering with inverted skill indices in PostgreSQL, followed by pgvector approximate nearest neighbor (HNSW/IVFFlat) and deterministic weighted re-ranking.`,
        keyPointsToCover: ['Vector indexing (HNSW)', 'Multi-factor re-ranking', 'Redis caching']
      }
    ],
    HR: [
      {
        id: 'q-hr-1',
        category: 'HR',
        question: `Why are you interested in joining ${targetJob.companyName} as a ${targetJob.title}?`,
        sampleAnswerHint: `Align your past accomplishments in building resilient systems with ${targetJob.companyName}'s mission and engineering challenges.`,
        keyPointsToCover: ['Company mission alignment', 'Relevant past challenges', 'Long-term aspirations']
      }
    ],
    PROJECT: [
      {
        id: 'q-proj-1',
        category: 'PROJECT',
        question: `Tell us about a time when a production release caused unexpected latency degradation and how you investigated it.`,
        sampleAnswerHint: `Use the STAR format (Situation, Task, Action, Result). Focus on APM tracing, database locking, and root cause prevention.`,
        keyPointsToCover: ['Structured problem solving', 'Observability tooling', 'Post-mortem actions']
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Candidate Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/20">
              AR
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Open to Work
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                {candidate.headline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {candidate.location} ({candidate.preferredWorkMode})
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  {candidate.yearsOfExperience} Years Experience
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                  ATS Resume Score: <strong className="text-emerald-400 ml-1">{resumeScoreData.atsScore}/100</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('RESUME')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Resume</span>
            </button>
            <button
              onClick={() => setActiveTab('MATCHES')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore AI Matches</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('MATCHES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'MATCHES'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Job Matches ({jobMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RESUME')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'RESUME'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume ATS Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('SKILL_GAP')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'SKILL_GAP'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Skill Gap & Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('INTERVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'INTERVIEW'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>AI Interview Prep</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'APPLICATIONS'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Track Applications ({applications.length})</span>
        </button>
      </div>

      {/* TAB 1: AI JOB MATCHES */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Top Recommended Opportunities</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Explainable 6-Factor Model
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Matches are calculated deterministically across required skills (40%), preferred skills (20%), experience (15%), education (10%), semantic vector (10%), and location (5%).
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{jobMatches.length}</strong> verified postings
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobMatches.map(({ job, breakdown, isApplied }) => {
              const score = breakdown.overallScore;
              let scoreColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
              if (score < 80) scoreColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
              if (score < 60) scoreColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';

              return (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    
                    {/* Job Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700/60 shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {job.companyName}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {job.location} ({job.workMode})
                          </span>
                          {job.salaryMin && (
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                              ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax! / 1000).toFixed(0)}k
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            Min {job.experienceMin} yrs experience
                          </span>
                        </div>

                        {/* Skills Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {job.requiredSkills.map(skill => {
                            const isMatched = candidate.skills.some(cs => cs.toLowerCase() === skill.toLowerCase());
                            return (
                              <span
                                key={skill}
                                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                                  isMatched
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                                }`}
                              >
                                {isMatched && <CheckCircle className="w-3 h-3" />}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Match Score Gauge & Actions */}
                    <div className="flex sm:flex-row lg:flex-col items-center sm:items-center lg:items-end justify-between sm:justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                      
                      {/* Score Badge */}
                      <button
                        onClick={() => setMatchDetailsModal({ job, breakdown })}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${scoreColor} hover:scale-105 transition-all text-left group/score`}
                        title="Click to view explainable mathematical breakdown"
                      >
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-black font-mono leading-none">
                            {score}%
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider block mt-0.5">
                            Match Score
                          </span>
                        </div>
                        <Sliders className="w-4 h-4 text-slate-400 group-hover/score:text-white transition-colors" />
                      </button>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMatchDetailsModal({ job, breakdown })}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                        >
                          Why Matched?
                        </button>

                        {isApplied ? (
                          <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => onApplyJob(job)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                          >
                            <span>1-Click Apply</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RESUME ATS ANALYZER */}
      {activeTab === 'RESUME' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: ATS Score Breakdown & Recommendations */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Resume ATS Score</span>
                </h3>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {resumeScoreData.atsScore}/100
                </span>
              </div>

              {/* Progress bars for categories */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Profile Completeness</span>
                    <span className="font-semibold">{resumeScoreData.completenessScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${resumeScoreData.completenessScore}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Technical Skills Density</span>
                    <span className="font-semibold">{resumeScoreData.skillsScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${resumeScoreData.skillsScore}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Quantified Achievements</span>
                    <span className="font-semibold">{resumeScoreData.experienceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${resumeScoreData.experienceScore}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>ATS Layout & Formatting</span>
                    <span className="font-semibold">{resumeScoreData.formattingScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${resumeScoreData.formattingScore}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Notice: Resume scores reflect deterministic ATS parsing heuristics and keyword density; scores do not guarantee job offer outcomes.
              </div>
            </div>

            {/* Strengths & Missing Keywords */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {resumeScoreData.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {resumeScoreData.missingKeywords.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    High-Value Keywords to Consider
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeScoreData.missingKeywords.map(kw => (
                      <span key={kw} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resumeScoreData.recommendations.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {resumeScoreData.recommendations.map((rec, idx) => (
                      <li key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Resume Editor */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Resume Content & Real-Time Parser</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your resume text below to instantly test how keyword density and metrics impact your ATS score.
                </p>
              </div>

              <button
                onClick={handleReanalyzeResume}
                disabled={isReanalyzing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isReanalyzing ? 'Re-scoring...' : 'Recalculate ATS Score'}</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={18}
                className="w-full flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
                placeholder="Paste or type your resume markdown / plain text..."
              />
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SKILL GAP & ROADMAP */}
      {activeTab === 'SKILL_GAP' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-purple-400" />
                  <span>Target Role Skill-Gap Analysis</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compare your current profile competencies against specific job requirements to generate a personalized learning roadmap.
                </p>
              </div>

              {/* Select target job */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-300">
                  Target Job:
                </label>
                <select
                  value={targetJobId}
                  onChange={(e) => setTargetJobId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.companyName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillGaps.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-white">
                      {item.skill}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Covered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {item.status === 'Covered' ? 'Skill Verified' : 'Competency Gap'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    {item.status === 'Covered'
                      ? `Candidate possesses verified experience in ${item.skill}.`
                      : `Target role strictly demands ${item.skill}. Building proficiency will directly boost your match percentage.`}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-slate-200 line-clamp-1">{item.course.title}</p>
                      <p className="text-[10px] text-slate-400">{item.course.provider} • {item.course.durationHours} hrs</p>
                    </div>
                  </div>

                  <a
                    href={item.course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    title="Open course details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI INTERVIEW PREPARATION */}
      {activeTab === 'INTERVIEW' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>AI Mock Interview Simulator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tailored questions dynamically synthesized from your verified resume and target role requirements.
                </p>
              </div>

              {/* Category picker */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {(['TECHNICAL', 'SYSTEM_DESIGN', 'PROJECT', 'HR'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setInterviewCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      interviewCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {(sampleInterviewQuestions[interviewCategory] || []).map(q => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {q.question}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase shrink-0">
                    {q.category}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                  <p className="font-semibold text-cyan-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended Answer Framework & Hint:
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {q.sampleAnswerHint}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-semibold">Key talking points:</span>
                  {q.keyPointsToCover.map(point => (
                    <span key={point} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60">
                      ✓ {point}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: APPLICATION TRACKER */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Application Pipeline & Status History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status progression across the 7 application stages: Applied, Screening, Shortlisted, Interview, Selected, Rejected, Withdrawn.
            </p>
          </div>

          <div className="space-y-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.companyLogo}
                      alt={app.companyName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-400">{app.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Match: {app.matchScore}%
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {app.currentStatus}
                    </span>
                  </div>
                </div>

                {/* Progress bar across 5 core stages */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                    {['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].map((stage, sIdx) => {
                      const stages = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
                      const currentIdx = stages.indexOf(app.currentStatus);
                      const isComplete = sIdx <= currentIdx;
                      const isCurrent = sIdx === currentIdx;

                      return (
                        <div key={stage} className="space-y-1">
                          <div className={`h-1.5 rounded-full transition-all ${
                            isComplete ? 'bg-emerald-500' : 'bg-slate-800'
                          }`} />
                          <span className={`block uppercase ${
                            isCurrent ? 'text-emerald-400 font-extrabold' : isComplete ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Timeline History */}
                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Audit Log & Updates:
                  </p>
                  <div className="space-y-2">
                    {app.timeline.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-200">[{t.status}]</span>{' '}
                          <span className="text-slate-400">{t.note}</span>{' '}
                          <span className="text-[10px] text-slate-500 font-mono">({new Date(t.changedAt).toLocaleTimeString()})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPLAINABLE MATCH DETAILS MODAL */}
      {matchDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setMatchDetailsModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Explainable AI Match Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  {matchDetailsModal.job.title} • {matchDetailsModal.job.companyName}
                </p>
              </div>
            </div>

            {/* Overall Score Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">
                  Calculated Overall Match
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  Deterministic sum of 6 weighted factors. No black-box guesses.
                </p>
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {matchDetailsModal.breakdown.overallScore}%
              </div>
            </div>

            {/* The 6 Factor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Required Skills (40%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.requiredSkillScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Preferred Skills (20%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.preferredSkillScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Experience Fit (15%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.experienceScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Education (10%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.educationScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Semantic Vector (10%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.semanticScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 font-medium">Work Mode / Loc (5%)</div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {matchDetailsModal.breakdown.locationScore}%
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-emerald-400 mb-1.5 uppercase tracking-wider">
                  Verified Fit Strengths:
                </h4>
                <ul className="space-y-1 text-slate-300">
                  {matchDetailsModal.breakdown.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {matchDetailsModal.breakdown.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-400 mb-1.5 uppercase tracking-wider">
                    Missing Requirements to Bridge:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchDetailsModal.breakdown.missingSkills.map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="font-bold text-cyan-400 block mb-1">AI Recommendation Summary:</span>
                {matchDetailsModal.breakdown.explanation}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setMatchDetailsModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Breakdown
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
