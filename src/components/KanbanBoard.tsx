import React from 'react';
import { Clock, Calendar, CheckSquare, MessageSquare, MoreVertical, AlertTriangle } from 'lucide-react';
import { Task, Project } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  { id: 'review', label: 'In Review', color: 'bg-amber-50 text-amber-700' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask,
}) => {
  const getProject = (projectId: string) => projects.find(p => p.id === projectId);

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Medium</span>;
      case 'low':
        return <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Low</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} className="bg-slate-100/70 rounded-xl p-4 flex flex-col h-[calc(100vh-160px)] border border-slate-200/80">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${col.color}`}>{col.label}</span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">({columnTasks.length})</span>
              </div>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No tasks
                </div>
              ) : (
                columnTasks.map(task => {
                  const project = getProject(task.projectId);
                  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;

                  return (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                    >
                      {/* Top metadata */}
                      <div className="flex items-center justify-between mb-2">
                        {project && (
                          <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md truncate max-w-[120px]"
                            style={{ backgroundColor: `${project.color}15`, color: project.color }}
                          >
                            {project.name}
                          </span>
                        )}
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer metrics */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                        {totalSubtasks > 0 ? (
                          <div className="flex items-center gap-1 font-mono tabular-nums">
                            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {task.dueDate && (
                          <div className="flex items-center gap-1 font-mono tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick status mover dropdown */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400">Move to:</span>
                        <select
                          value={task.status}
                          onChange={e => onUpdateTaskStatus(task.id, e.target.value as any)}
                          className="text-[11px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
