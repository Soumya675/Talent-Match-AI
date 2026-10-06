import React from 'react';
import { User, UserRole } from '../types';
import { 
  Briefcase, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  KeyRound, 
  FileCode2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onSelectRole,
  onOpenAuth,
  onOpenArchitecture,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CareerAI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Production SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Explainable AI Job & Resume Matching Engine
              </p>
            </div>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onSelectRole('CANDIDATE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'CANDIDATE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate</span>
            </button>

            <button
              onClick={() => onSelectRole('EMPLOYER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'EMPLOYER'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employer</span>
            </button>

            <button
              onClick={() => onSelectRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-900/50 transition-colors shadow-sm"
              title="View Architecture Diagrams, ERD, and Phase 1 Specification"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Architecture & ERD</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  {currentUser.avatarUrl && (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {currentUser.role.toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>OTP Login</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
