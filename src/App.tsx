import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { api } from './services/api';
import { Task, Project, User } from './types';
import { Plus } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'analytics'>('kanban');

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Check auth & load data on mount
  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem('taskflow_token');
        if (token) {
          const profile = await api.getMe();
          setUser(profile.user);
        } else {
          // Auto login demo user or open auth
          try {
            const loginRes = await api.login('alex@taskflow.pro', 'password123');
            setUser(loginRes.user);
          } catch (e) {
            console.log('Demo login note:', e);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        loadAppData();
      }
    }
    init();
  }, []);

  const loadAppData = async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedProjects] = await Promise.all([
        api.getTasks({
          projectId: selectedProjectId || undefined,
          status: selectedStatus || undefined,
          priority: selectedPriority || undefined,
        }),
        api.getProjects(),
      ]);
      setTasks(fetchedTasks);
      setProjects(fetchedProjects);
    } catch (err) {
      console.error('Failed to load app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [selectedProjectId, selectedStatus, selectedPriority]);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadAppData();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      loadAppData();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewTask={handleOpenNewTask}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1">
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          onOpenNewProject={async () => {
            const name = prompt('Enter new project name:');
            if (!name) return;
            const description = prompt('Enter project description:') || '';
            const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            try {
              await api.createProject({ name, description, color });
              loadAppData();
            } catch (err: any) {
              alert(err.message || 'Failed to create project');
            }
          }}
        />

        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-96 flex items-center justify-center text-slate-400 text-sm">
              Loading workspace tasks...
            </div>
          ) : (
            <>
              {activeView === 'kanban' && (
                <KanbanBoard
                  tasks={tasks}
                  projects={projects}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
              {activeView === 'list' && (
                <ListView
                  tasks={tasks}
                  projects={projects}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}
              {activeView === 'analytics' && (
                <AnalyticsView tasks={tasks} projects={projects} />
              )}
            </>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={loadAppData}
        projects={projects}
        taskToEdit={taskToEdit}
        defaultProjectId={selectedProjectId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={u => {
          setUser(u);
          loadAppData();
        }}
      />

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        tasks={tasks}
      />
    </div>
  );
}
