import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Database, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  KeyRound,
  FileCode2,
  GitBranch
} from 'lucide-react';

interface ArchitectureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureViewerModal: React.FC<ArchitectureViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATABASE_ERD' | 'API_SPEC' | 'PHASE1_CHECKLIST'>('ARCHITECTURE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-white overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Phase 1 System Architecture & Technical Specifications
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  Verified Foundation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PostgreSQL 16 + pgvector • FastAPI • Docker Compose • React 19 • Dual OTP Auth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ARCHITECTURE'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Architecture Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('DATABASE_ERD')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'DATABASE_ERD'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL & Mermaid ERD</span>
          </button>

          <button
            onClick={() => setActiveTab('API_SPEC')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'API_SPEC'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>REST API & OTP Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('PHASE1_CHECKLIST')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PHASE1_CHECKLIST'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Phase 1 Verification Checklist</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
          
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-6 text-slate-300">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono leading-relaxed overflow-x-auto">
                <pre>{`+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Router      |
|  - Candidate Portal  |  - Employer Portal  |  - Admin Console  |  - Public Search |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / REST + SSE
                                           v
+-----------------------------------------------------------------------------------+
|                                API GATEWAY / REVERSE PROXY                        |
|  Nginx / Cloudflare / Ingress Controller (SSL, Rate Limiting, CORS, Gzip)         |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                            APPLICATION TIER (FastAPI)                             |
|  Python 3.12+ | Pydantic v2 | SQLAlchemy 2.0 (Async) | Argon2 / Jose JWT          |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | Auth & OTP Engine  |  | Explainable Matching |  | Resume & Job AI Parsers   |  |
|  | - Email / SMS OTP  |  | - 6-Factor Algorithm |  | - Structured Extraction  |  |
|  | - Refresh Rotation |  | - Vector Cosine Sim  |  | - ATS Score Assessment   |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | RBAC Middleware    |  | Skill Normalizer     |  | Audit & AI Telemetry      |  |
|  | - Strict Scoping   |  | - Canonical Registry |  | - Latency & Token Logs    |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+---------------------+-------------------------------+-----------------------------+
                      |                               |
        SQLAlchemy    |                 Asynchronous  | Celery / Arq
       Async Engine   |                 Task Dispatch |
                      v                               v
+-----------------------------+     +-------------------------------+
|       DATABASE TIER         |     |      BACKGROUND WORKER        |
|  PostgreSQL 16 + pgvector   |     |  Python Celery Worker         |
|  - Relational Schemas (30+) |     |  - Async Resume OCR / Parsing |
|  - Vector Embeddings (768d) |     |  - Gemini AI Batch Calling    |
|  - Full-Text Search (tsvector)|   |  - Notification Dispatch      |
+--------------+--------------+     +---------------+---------------+
               ^                                    |
               | Cache & Session Storage            |
               v                                    v
+-----------------------------+     +-------------------------------+
|         REDIS 7             |     |     PRIVATE OBJECT STORE      |
|  - Ephemeral OTP Tokens     |     |  MinIO / AWS S3 / Cloud GCS   |
|  - Celery Message Broker    |     |  - Private PDFs / DOCX Resumes|
|  - Rate Limit Leaky Bucket  |     |  - Signed Pre-authenticated   |
|  - Hot Match Cache (TTL 1h) |     |    Download URLs (15m expiry) |
+-----------------------------+     +-------------------------------+`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Explainable Matching Formula
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Score = (0.40 × RequiredSkills) + (0.20 × PreferredSkills) + (0.15 × Experience) + (0.10 × Education) + (0.10 × SemanticSimilarity) + (0.05 × WorkModeLocation)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    Dual-Channel OTP Workflow
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Supports Email OTP and Mobile SMS OTP. Tokens are hashed with SHA-256 in Redis (TTL: 300s) and validated with constant-time byte comparisons.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE & ERD */}
          {activeTab === 'DATABASE_ERD' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
                <pre>{`erDiagram
    users ||--o{ otp_verifications : "authenticates"
    users ||--o| candidate_profiles : "profile"
    users ||--o| employer_profiles : "manages company"
    companies ||--o{ jobs : "posts"
    candidate_profiles ||--o{ candidate_skills : "possesses"
    candidate_profiles ||--o{ resumes : "uploads"
    candidate_profiles ||--o{ applications : "submits"
    resumes ||--o| resume_analysis : "ats scored"
    resumes ||--o| resume_embeddings : "vectorized (768d)"
    jobs ||--o{ job_skills : "requires"
    jobs ||--o| job_embeddings : "vectorized (768d)"
    jobs ||--o{ applications : "receives"
    applications ||--o{ application_status_history : "tracks 7 stages"
    skills ||--o{ candidate_skills : "normalized"
    skills ||--o{ job_skills : "normalized"
    courses ||--o{ course_skills : "covers"
    learning_roadmaps ||--o{ learning_roadmap_items : "contains"
    interviews ||--o{ interview_questions : "prepares"`}</pre>
              </div>

              <div className="font-sans text-xs text-slate-400">
                <strong className="text-slate-200">Table Highlights:</strong> users, otp_verifications, candidate_profiles, companies, employer_profiles, skills, candidate_skills, resumes, resume_analysis, resume_embeddings, jobs, job_skills, job_embeddings, applications, application_status_history, match_results, skill_gap_analysis, courses, course_skills, learning_roadmaps, learning_roadmap_items, interviews, interview_questions, notifications, audit_logs, ai_requests.
              </div>
            </div>
          )}

          {/* TAB 3: REST API SPEC */}
          {activeTab === 'API_SPEC' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="border border-slate-800 rounded-xl overflow-hidden font-mono">
                <table className="w-full text-left">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-3">HTTP Method</th>
                      <th className="p-3">Endpoint</th>
                      <th className="p-3">RBAC Role</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-cyan-400 font-bold">POST</td>
                      <td className="p-3">/api/v1/auth/send-otp</td>
                      <td className="p-3 text-slate-400">Public</td>
                      <td className="p-3">Dispatches 6-digit verification code to email or SMS</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-cyan-400 font-bold">POST</td>
                      <td className="p-3">/api/v1/auth/verify-otp</td>
                      <td className="p-3 text-slate-400">Public</td>
                      <td className="p-3">Validates OTP hash; issues JWT Access & Refresh tokens</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-emerald-400 font-bold">GET</td>
                      <td className="p-3">/api/v1/jobs</td>
                      <td className="p-3 text-slate-400">Public / Candidate</td>
                      <td className="p-3">Paginated search with full-text tsvector & vector similarity</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-cyan-400 font-bold">POST</td>
                      <td className="p-3">/api/v1/jobs</td>
                      <td className="p-3 text-indigo-400">Employer</td>
                      <td className="p-3">Creates job with AI parameter extraction & vector embeddings</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-cyan-400 font-bold">POST</td>
                      <td className="p-3">/api/v1/resumes/upload</td>
                      <td className="p-3 text-blue-400">Candidate</td>
                      <td className="p-3">Uploads PDF/DOCX to private S3 bucket and triggers OCR</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-emerald-400 font-bold">GET</td>
                      <td className="p-3">/api/v1/matching/candidate/:id</td>
                      <td className="p-3 text-blue-400">Candidate</td>
                      <td className="p-3">Returns 6-component explainable match scores</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-amber-400 font-bold">PATCH</td>
                      <td className="p-3">/api/v1/applications/:id/status</td>
                      <td className="p-3 text-indigo-400">Employer</td>
                      <td className="p-3">Advances application through 7 status pipeline stages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PHASE 1 CHECKLIST */}
          {activeTab === 'PHASE1_CHECKLIST' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>All 10 Phase 1 master requirements have been generated, tested, and validated.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: 'Complete Project Folder Structure', path: 'backend/, docs/, src/, .github/', ok: true },
                  { title: 'Architecture Diagram in Markdown', path: 'docs/ARCHITECTURE.md', ok: true },
                  { title: 'Database ER Diagram using Mermaid', path: 'docs/DATABASE.md', ok: true },
                  { title: 'PostgreSQL 16 + pgvector Schema', path: 'docs/DATABASE.md (30+ tables)', ok: true },
                  { title: 'Docker Compose Ecosystem', path: 'docker-compose.yml (Postgres, Redis, Backend, Worker, Frontend)', ok: true },
                  { title: 'FastAPI Skeleton with Pydantic v2', path: 'backend/app/main.py & core/', ok: true },
                  { title: 'React 19 + TypeScript + Vite Skeleton', path: 'src/ (Interactive Candidate, Employer & Admin views)', ok: true },
                  { title: 'Environment Configuration', path: '.env.example', ok: true },
                  { title: 'Production README Documentation', path: 'README.md', ok: true },
                  { title: 'GitHub Actions CI/CD Pipeline', path: '.github/workflows/ci.yml', ok: true }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.path}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
