import React, { useState } from 'react';
import { User, UserRole, Job, Application, ApplicationStatus } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ArchitectureViewerModal } from './components/ArchitectureViewerModal';
import { CandidateDashboard } from './components/CandidatePortal/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerPortal/EmployerDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { 
  MOCK_USERS, 
  INITIAL_CANDIDATE, 
  MOCK_JOBS, 
  MOCK_APPLICATIONS 
} from './services/mockData';
import { CheckCircle2, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]); // default candidate
  const [currentRole, setCurrentRole] = useState<UserRole>('CANDIDATE');
  
  // Platform interactive state
  const [candidateProfile, setCandidateProfile] = useState(INITIAL_CANDIDATE);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    // Find matching mock user for role
    const matchedUser = MOCK_USERS.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
    showToast(`Switched view to ${role.toLowerCase()} portal`);
  };

  const handleApplyJob = (job: Job) => {
    const existing = applications.find(a => a.jobId === job.id);
    if (existing) {
      showToast('You have already submitted an application for this role');
      return;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      candidateId: candidateProfile.id,
      candidateName: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
      candidateEmail: 'alex.rivera@example.com',
      candidateExperience: candidateProfile.yearsOfExperience,
      matchScore: 91.5,
      currentStatus: 'APPLIED',
      appliedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'APPLIED',
          changedAt: new Date().toISOString(),
          note: 'Application submitted with verified resume via CareerAI 1-Click Match.'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    showToast(`Application successfully submitted for "${job.title}"!`);
  };

  const handleCreateJob = (newJobData: Partial<Job>) => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyId: newJobData.companyId || 'comp-1',
      companyName: newJobData.companyName || 'CloudScale Systems',
      companyLogo: newJobData.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      title: newJobData.title || 'Senior Software Engineer',
      description: newJobData.description || '',
      responsibilities: newJobData.responsibilities || [],
      requirements: newJobData.requirements || [],
      requiredSkills: newJobData.requiredSkills || ['Python', 'FastAPI'],
      preferredSkills: newJobData.preferredSkills || [],
      employmentType: newJobData.employmentType || 'FULL_TIME',
      workMode: newJobData.workMode || 'REMOTE',
      location: newJobData.location || 'Remote',
      salaryMin: newJobData.salaryMin,
      salaryMax: newJobData.salaryMax,
      salaryCurrency: 'USD',
      experienceMin: newJobData.experienceMin || 2,
      educationRequired: 'bachelors',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    showToast(`Job "${newJob.title}" published and indexed with pgvector!`);
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: ApplicationStatus, note?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const updatedTimeline = [
        ...app.timeline,
        {
          status: newStatus,
          changedAt: new Date().toISOString(),
          note: note || `Application transitioned to ${newStatus}`
        }
      ];
      return {
        ...app,
        currentStatus: newStatus,
        notes: note || app.notes,
        timeline: updatedTimeline
      };
    }));
    showToast(`Application stage updated to ${newStatus}`);
  };

  const handleUpdateResume = (newText: string) => {
    showToast('Resume ATS metrics recomputed and skills synchronized');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Global Navigation */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner notification for Phase 1 verification */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-white">Phase 1 Foundation Operational:</span>{' '}
              <span className="text-slate-300">FastAPI backend models, PostgreSQL schema (30+ tables), Docker Compose, and dual Email/SMS OTP auth are ready.</span>
            </div>
          </div>
          <button
            onClick={() => setIsArchitectureOpen(true)}
            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inspect Diagrams & Specs</span>
          </button>
        </div>

        {/* Portal Switching */}
        {currentRole === 'CANDIDATE' && (
          <CandidateDashboard
            candidate={candidateProfile}
            jobs={jobs}
            applications={applications}
            onApplyJob={handleApplyJob}
            onUpdateResume={handleUpdateResume}
          />
        )}

        {currentRole === 'EMPLOYER' && (
          <EmployerDashboard
            jobs={jobs}
            applications={applications}
            onCreateJob={handleCreateJob}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminDashboard
            totalJobs={jobs.length}
            totalApplications={applications.length}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CareerAI</span>
            <span>•</span>
            <span>Explainable AI Job & Resume Matching SaaS Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              System Architecture
            </button>
            <span>•</span>
            <span>PostgreSQL 16 + pgvector</span>
            <span>•</span>
            <span>FastAPI 0.111</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal with OTP flow */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={currentRole}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      {/* Architecture & Specs Modal */}
      <ArchitectureViewerModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
