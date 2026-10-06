import React, { useState } from 'react';
import { Job, Application, ApplicationStatus } from '../../types';
import { 
  Briefcase, 
  PlusCircle, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  DollarSign, 
  Filter, 
  ChevronRight,
  Send,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface EmployerDashboardProps {
  jobs: Job[];
  applications: Application[];
  onCreateJob: (newJob: Partial<Job>) => void;
  onUpdateApplicationStatus: (appId: string, newStatus: ApplicationStatus, note?: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  jobs,
  applications,
  onCreateJob,
  onUpdateApplicationStatus
}) => {
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'POST_JOB' | 'APPLICANTS'>('LISTINGS');
  
  // Job Creation Form State
  const [rawJobDescription, setRawJobDescription] = useState(
    'Looking for a Senior Python Backend Developer with strong FastAPI, PostgreSQL, Redis, and Docker experience. Must have 3+ years experience. Remote or Hybrid in Austin, TX. Salary $140,000 - $175,000.'
  );
  const [extractedTitle, setExtractedTitle] = useState('Senior Python Backend Developer');
  const [extractedSkills, setExtractedSkills] = useState<string[]>(['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker']);
  const [extractedPrefSkills, setExtractedPrefSkills] = useState<string[]>(['Kubernetes', 'Celery', 'AWS']);
  const [extractedExpMin, setExtractedExpMin] = useState(3);
  const [extractedLocation, setExtractedLocation] = useState('Austin, TX (Remote)');
  const [extractedWorkMode, setExtractedWorkMode] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('REMOTE');
  const [extractedSalaryMin, setExtractedSalaryMin] = useState(140000);
  const [extractedSalaryMax, setExtractedSalaryMax] = useState(175000);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);

  // Applicant Review filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const handleAIExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const lower = rawJobDescription.toLowerCase();

      // Heuristic skill extraction
      const potentialSkills = ['Python', 'FastAPI', 'Django', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Go', 'GraphQL'];
      const found = potentialSkills.filter(s => lower.includes(s.toLowerCase()));
      
      setExtractedSkills(found.length > 0 ? found : ['Python', 'FastAPI', 'PostgreSQL']);
      
      if (lower.includes('senior')) {
        setExtractedTitle('Senior Backend Software Engineer');
        setExtractedExpMin(4);
      } else if (lower.includes('lead')) {
        setExtractedTitle('Staff / Lead Systems Engineer');
        setExtractedExpMin(6);
      } else {
        setExtractedTitle('Software Engineer');
        setExtractedExpMin(2);
      }

      if (lower.includes('remote')) {
        setExtractedWorkMode('REMOTE');
      } else if (lower.includes('hybrid')) {
        setExtractedWorkMode('HYBRID');
      } else {
        setExtractedWorkMode('ONSITE');
      }

      setIsExtracting(false);
    }, 600);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateJob({
      title: extractedTitle,
      companyId: 'comp-1',
      companyName: 'CloudScale Systems',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      description: rawJobDescription,
      responsibilities: [
        'Architect high-throughput scalable services',
        'Maintain database schemas and performance profiling'
      ],
      requirements: [
        `Min ${extractedExpMin} years industry experience`,
        'Demonstrated production track record'
      ],
      requiredSkills: extractedSkills,
      preferredSkills: extractedPrefSkills,
      employmentType: 'FULL_TIME',
      workMode: extractedWorkMode,
      location: extractedLocation,
      salaryMin: extractedSalaryMin,
      salaryMax: extractedSalaryMax,
      salaryCurrency: 'USD',
      experienceMin: extractedExpMin,
      educationRequired: 'bachelors',
      status: 'ACTIVE'
    });

    setIsCreatedSuccess(true);
    setTimeout(() => {
      setIsCreatedSuccess(false);
      setActiveTab('LISTINGS');
    }, 1200);
  };

  const filteredApplications = applications.filter(app => {
    if (selectedStatusFilter === 'ALL') return true;
    return app.currentStatus === selectedStatusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Employer Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl text-indigo-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  CloudScale Systems
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Verified Employer
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                Recruitment & Candidate Talent Dashboard • Managed by Sarah Chen (VP Talent)
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span>Active Postings: <strong className="text-white">{jobs.length}</strong></span>
                <span>Total Applications: <strong className="text-white">{applications.length}</strong></span>
                <span>Avg Candidate Match: <strong className="text-emerald-400">89.6%</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('POST_JOB')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('LISTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'LISTINGS'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Job Postings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICANTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'APPLICANTS'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicants & Pipeline ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('POST_JOB')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'POST_JOB'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Job Creator</span>
        </button>
      </div>

      {/* TAB 1: JOB LISTINGS */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">{job.title}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-3xl leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location} ({job.workMode})
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      Min {job.experienceMin} yrs experience
                    </span>
                    {job.salaryMin && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax! / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requiredSkills.map(sk => (
                      <span key={sk} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <button
                    onClick={() => setActiveTab('APPLICANTS')}
                    className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Applicants</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: APPLICANTS REVIEW PIPELINE */}
      {activeTab === 'APPLICANTS' && (
        <div className="space-y-4">
          
          {/* Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-300">Filter by Stage:</span>
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedStatusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-slate-400">
              Showing {filteredApplications.length} candidates
            </span>
          </div>

          <div className="space-y-4">
            {filteredApplications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-white">{app.candidateName}</h4>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Match: {app.matchScore}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {app.currentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    Applying for: <strong className="text-white">{app.jobTitle}</strong> • {app.candidateExperience} yrs verified experience
                  </p>

                  {app.notes && (
                    <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      Note: {app.notes}
                    </p>
                  )}
                </div>

                {/* Advance Pipeline Status dropdown */}
                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Advance Stage:</span>
                  <select
                    value={app.currentStatus}
                    onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as ApplicationStatus, `Stage changed by employer to ${e.target.value}`)}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <button
                    onClick={() => onUpdateApplicationStatus(app.id, 'INTERVIEW', 'Interview schedule invitation sent to candidate')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Invite Interview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI JOB CREATOR */}
      {activeTab === 'POST_JOB' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI Job Description Analyzer & Publisher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Type or paste your unstructured job description. The AI engine will parse mandatory skills, experience parameters, and create an indexable posting.
            </p>
          </div>

          {isCreatedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Job published successfully! Redirecting to active listings...</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Raw Job Description
              </label>
              <textarea
                value={rawJobDescription}
                onChange={(e) => setRawJobDescription(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAIExtract}
                disabled={isExtracting}
                className="mt-2 px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExtracting ? 'Analyzing Description...' : 'AI Auto-Extract Parameters'}</span>
              </button>
            </div>

            {/* Extracted Structured Parameters */}
            <form onSubmit={handlePostJobSubmit} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={extractedTitle}
                    onChange={(e) => setExtractedTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location & Work Mode
                  </label>
                  <input
                    type="text"
                    value={extractedLocation}
                    onChange={(e) => setExtractedLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Core Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={extractedSkills.join(', ')}
                  onChange={(e) => setExtractedSkills(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Minimum Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={extractedExpMin}
                    onChange={(e) => setExtractedExpMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Salary ($)
                  </label>
                  <input
                    type="number"
                    value={extractedSalaryMin}
                    onChange={(e) => setExtractedSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Salary ($)
                  </label>
                  <input
                    type="number"
                    value={extractedSalaryMax}
                    onChange={(e) => setExtractedSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Job & Index with pgvector</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
