import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Layers } from 'lucide-react';
import { Task, Project } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, projects }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalEstHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const totalActHours = tasks.reduce((acc, t) => acc + (t.actualHours || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Productivity & Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time telemetry and task completion metrics across projects.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Completion Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{completionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">{completedTasks} of {totalTasks} tasks completed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">In Progress</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{inProgressTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active tasks in flight</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Urgent Priority</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{urgentTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires immediate attention</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Estimated Hours</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalEstHours}h</div>
          <div className="text-[11px] text-slate-400 mt-1">Total projected workload</div>
        </div>
      </div>

      {/* Project Progress Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Project Workload Breakdown</h3>
        <div className="space-y-4">
          {projects.map(proj => {
            const projTasks = tasks.filter(t => t.projectId === proj.id);
            const projCompleted = projTasks.filter(t => t.status === 'completed').length;
            const pct = projTasks.length > 0 ? Math.round((projCompleted / projTasks.length) * 100) : 0;

            return (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }} />
                    <span className="text-slate-900">{proj.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono tabular-nums">{projCompleted}/{projTasks.length} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: proj.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
