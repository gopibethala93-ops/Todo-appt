import React, { useState } from 'react';
import { Folder, Plus, Layers, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  selectedPriority: string | null;
  setSelectedPriority: (priority: string | null) => void;
  onOpenNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  onOpenNewProject,
}) => {
  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspaces & Projects</span>
          <button
            onClick={onOpenNewProject}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200/60 transition-colors"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedProjectId(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedProjectId === null ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>All Projects</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedProjectId === null ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'}`}>
              Global
            </span>
          </button>

          {projects.map(proj => (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedProjectId === proj.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                <span className="truncate">{proj.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter by Status */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          <Filter className="w-3.5 h-3.5" />
          <span>Status Filter</span>
        </div>
        <div className="space-y-1">
          {[
            { id: null, label: 'All Statuses' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'review', label: 'In Review' },
            { id: 'completed', label: 'Completed' },
          ].map(s => (
            <button
              key={s.id || 'all'}
              onClick={() => setSelectedStatus(s.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                selectedStatus === s.id ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-200/40'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter by Priority */}
      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Priority Filter</div>
        <div className="space-y-1">
          {[
            { id: null, label: 'All Priorities' },
            { id: 'urgent', label: 'Urgent Priority' },
            { id: 'high', label: 'High Priority' },
            { id: 'medium', label: 'Medium Priority' },
            { id: 'low', label: 'Low Priority' },
          ].map(p => (
            <button
              key={p.id || 'all'}
              onClick={() => setSelectedPriority(p.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                selectedPriority === p.id ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-200/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-200 text-center">
        <div className="text-[11px] text-slate-400 font-mono">TaskFlow MERN Stack v2.5</div>
      </div>
    </aside>
  );
};
