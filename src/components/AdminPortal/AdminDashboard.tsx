import React, { useState } from 'react';
import { SKILL_NORMALIZATION_MAP } from '../../services/matchingEngine';
import { MOCK_COURSES } from '../../services/mockData';
import { 
  ShieldCheck, 
  Database, 
  Cpu, 
  Activity, 
  GitMerge, 
  BookOpen, 
  Plus, 
  Check, 
  AlertCircle,
  Clock,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  totalJobs: number;
  totalApplications: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  totalJobs,
  totalApplications
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'SKILLS' | 'COURSES' | 'AUDIT'>('METRICS');
  
  // Skill aliases list
  const [skillAliases, setSkillAliases] = useState(
    Object.entries(SKILL_NORMALIZATION_MAP).map(([alias, canonical], idx) => ({
      id: idx + 1,
      alias,
      canonical
    }))
  );

  const [newAlias, setNewAlias] = useState('');
  const [newCanonical, setNewCanonical] = useState('');

  // Course list
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSkill, setNewCourseSkill] = useState('');
  const [newCourseProvider, setNewCourseProvider] = useState('');

  // AI telemetry logs
  const [aiLogs] = useState([
    {
      id: 'ai-req-101',
      requestType: 'EXPLAINABLE_MATCH_COMPUTATION',
      model: 'deterministic-v1+embedding-768',
      tokens: 412,
      latencyMs: 38,
      status: 'SUCCESS',
      timestamp: '2 mins ago'
    },
    {
      id: 'ai-req-102',
      requestType: 'RESUME_ATS_PARSING',
      model: 'gemini-3.8-flash',
      tokens: 1240,
      latencyMs: 340,
      status: 'SUCCESS',
      timestamp: '5 mins ago'
    },
    {
      id: 'ai-req-103',
      requestType: 'JOB_DESCRIPTION_EXTRACTION',
      model: 'gemini-3.8-flash',
      tokens: 680,
      latencyMs: 215,
      status: 'SUCCESS',
      timestamp: '14 mins ago'
    },
    {
      id: 'ai-req-104',
      requestType: 'INTERVIEW_PREP_SYNTHESIS',
      model: 'gemini-3.8-flash',
      tokens: 890,
      latencyMs: 290,
      status: 'SUCCESS',
      timestamp: '25 mins ago'
    }
  ]);

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim() || !newCanonical.trim()) return;
    setSkillAliases(prev => [
      { id: prev.length + 1, alias: newAlias.trim().toLowerCase(), canonical: newCanonical.trim() },
      ...prev
    ]);
    setNewAlias('');
    setNewCanonical('');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseSkill.trim()) return;
    setCourses(prev => [
      {
        id: `course-${Date.now()}`,
        title: newCourseTitle,
        skill: newCourseSkill,
        provider: newCourseProvider || 'Self-Paced Learning',
        durationHours: 15,
        url: 'https://example.com'
      },
      ...prev
    ]);
    setNewCourseTitle('');
    setNewCourseSkill('');
    setNewCourseProvider('');
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-2xl text-purple-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Super Admin Management Console
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Root Governance
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                Audit Logs • Skill Normalization Dictionary • Model Telemetry • Course Catalog
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Total Active Jobs</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalJobs}</div>
          <p className="text-[11px] text-emerald-400 mt-1">100% vector-indexed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Applications Tracked</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalApplications}</div>
          <p className="text-[11px] text-slate-400 mt-1">7 stages monitored</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Canonical Skill Maps</span>
            <GitMerge className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{skillAliases.length}</div>
          <p className="text-[11px] text-purple-400 mt-1">Prevents mismatch</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>AI Operations Logged</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{aiLogs.length * 142}</div>
          <p className="text-[11px] text-cyan-400 mt-1">Avg latency: 45ms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'METRICS'
              ? 'bg-purple-600/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Health</span>
        </button>

        <button
          onClick={() => setActiveTab('SKILLS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'SKILLS'
              ? 'bg-purple-600/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitMerge className="w-4 h-4" />
          <span>Skill Normalization Master</span>
        </button>

        <button
          onClick={() => setActiveTab('COURSES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'COURSES'
              ? 'bg-purple-600/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-purple-600/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>AI Request Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: PLATFORM HEALTH */}
      {activeTab === 'METRICS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>PostgreSQL & pgvector Status</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Database Engine:</span>
                <span className="font-mono text-emerald-400 font-bold">PostgreSQL 16.3</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Vector Extension:</span>
                <span className="font-mono text-emerald-400 font-bold">pgvector 0.7.0 (Active)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Vector Dimension:</span>
                <span className="font-mono text-white">768-dim (gemini-embedding-2)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Connection Pool:</span>
                <span className="font-mono text-emerald-400">12 / 50 Active Pools</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Redis & Worker Queue Status</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Broker:</span>
                <span className="font-mono text-emerald-400 font-bold">Redis 7.2 (Standalone)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Active Celery Workers:</span>
                <span className="font-mono text-emerald-400 font-bold">4 Worker Threads</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>Pending Async OCR Tasks:</span>
                <span className="font-mono text-white">0 in Queue</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span>OTP Cache Keys:</span>
                <span className="font-mono text-white">Managed with 300s TTL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKILL NORMALIZATION */}
      {activeTab === 'SKILLS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-purple-400" />
                <span>Canonical Skill Normalizer Master</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensures that candidate resumes with variations like "React.js" or "JS" correctly match jobs requesting "React" or "JavaScript".
              </p>
            </div>
          </div>

          {/* Add new alias form */}
          <form onSubmit={handleAddAlias} className="flex flex-wrap items-center gap-2 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="font-semibold text-slate-300">Add New Mapping:</span>
            <input
              type="text"
              placeholder="Alias (e.g. vuejs)"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <span className="text-slate-500">maps to</span>
            <input
              type="text"
              placeholder="Canonical (e.g. Vue.js)"
              value={newCanonical}
              onChange={(e) => setNewCanonical(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Map Skill</span>
            </button>
          </form>

          {/* Table of mappings */}
          <div className="max-h-96 overflow-y-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold sticky top-0">
                <tr>
                  <th className="p-3">Variation / Raw Alias</th>
                  <th className="p-3">Canonical Normalized Skill</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {skillAliases.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">"{item.alias}"</td>
                    <td className="p-3 text-emerald-400 font-bold">{item.canonical}</td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE CATALOG */}
      {activeTab === 'COURSES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Curriculum & Learning Catalog Management</span>
          </h3>
          <p className="text-xs text-slate-400">
            Certified courses linked to missing skills to power the automated candidate learning roadmaps.
          </p>

          <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <input
              type="text"
              placeholder="Course Title"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Associated Skill (e.g. AWS)"
              value={newCourseSkill}
              onChange={(e) => setNewCourseSkill(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Provider (e.g. Coursera)"
              value={newCourseProvider}
              onChange={(e) => setNewCourseProvider(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </form>

          <div className="space-y-2">
            {courses.map(course => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{course.title}</h4>
                  <p className="text-[11px] text-slate-400">{course.provider} • Covers: <strong className="text-cyan-400">{course.skill}</strong></p>
                </div>
                <span className="font-mono text-slate-300">{course.durationHours} hrs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Real-Time AI Telemetry & Audit Logs</span>
            </h3>
            <span className="text-xs text-slate-400">Schema table: <strong className="text-white font-mono">ai_requests</strong></span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-800/80 text-slate-300">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Operation</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Tokens</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {aiLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-500">{log.id}</td>
                    <td className="p-3 text-white font-semibold">{log.requestType}</td>
                    <td className="p-3 text-cyan-400">{log.model}</td>
                    <td className="p-3">{log.tokens}</td>
                    <td className="p-3 text-emerald-400 font-bold">{log.latencyMs}ms</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
