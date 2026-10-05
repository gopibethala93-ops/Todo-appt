import React from 'react';
import { CheckSquare, Sparkles, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeView: 'kanban' | 'list' | 'analytics';
  setActiveView: (view: 'kanban' | 'list' | 'analytics') => void;
  onOpenNewTask: () => void;
  onOpenAiAssistant: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  setActiveView,
  onOpenNewTask,
  onOpenAiAssistant,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Brand title, one line */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-950">TaskFlow Pro</span>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>JWT Secured MERN Stack</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation views */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setActiveView('kanban')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Task List
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Analytics & Insights
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini AI Coach</span>
        </button>

        <button
          onClick={onOpenNewTask}
          className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
        >
          + New Task
        </button>

        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-slate-200 object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
