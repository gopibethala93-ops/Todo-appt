import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string; // Owner or creator
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  assignees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed default demo data if files don't exist
function initDb() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUser: User = {
      id: 'user_demo_1',
      name: 'Alex Morgan',
      email: 'alex@taskflow.pro',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([demoUser], null, 2));
  }

  if (!fs.existsSync(PROJECTS_FILE)) {
    const demoProjects: Project[] = [
      {
        id: 'proj_1',
        userId: 'user_demo_1',
        name: 'Q3 Product Launch',
        description: 'Core feature rollout & marketing alignment for enterprise release',
        color: '#6366f1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'proj_2',
        userId: 'user_demo_1',
        name: 'Design System V2',
        description: 'Migrating legacy UI components to Tailwind CSS & accessible tokens',
        color: '#ec4899',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'proj_3',
        userId: 'user_demo_1',
        name: 'Infrastructure Scaling',
        description: 'Migrating backend services to Kubernetes & optimizing database queries',
        color: '#10b981',
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(demoProjects, null, 2));
  }

  if (!fs.existsSync(TASKS_FILE)) {
    const demoTasks: Task[] = [
      {
        id: 'task_1',
        userId: 'user_demo_1',
        title: 'Implement JWT Authentication middleware',
        description: 'Secure all API endpoints with Bearer token validation and role-based guards.',
        status: 'completed',
        priority: 'urgent',
        projectId: 'proj_3',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimatedHours: 6,
        actualHours: 5,
        tags: ['Backend', 'Security', 'Auth'],
        subtasks: [
          { id: 'sub_1', title: 'Setup jsonwebtoken & bcrypt', completed: true },
          { id: 'sub_2', title: 'Create auth middleware', completed: true },
          { id: 'sub_3', title: 'Write unit tests for login/register', completed: true }
        ],
        comments: [
          { id: 'com_1', userId: 'user_demo_1', userName: 'Alex Morgan', content: 'Completed ahead of schedule!', createdAt: new Date().toISOString() }
        ],
        assignees: ['Alex Morgan'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_2',
        userId: 'user_demo_1',
        title: 'Design Kanban drag-and-drop board',
        description: 'Build interactive column swimlanes with smooth motion animations and priority badges.',
        status: 'in_progress',
        priority: 'high',
        projectId: 'proj_2',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        estimatedHours: 12,
        actualHours: 8,
        tags: ['Frontend', 'UI/UX', 'React'],
        subtasks: [
          { id: 'sub_4', title: 'Implement column drop targets', completed: true },
          { id: 'sub_5', title: 'Add card reordering animation', completed: false },
          { id: 'sub_6', title: 'Optimize touch gestures for mobile', completed: false }
        ],
        comments: [],
        assignees: ['Alex Morgan'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_3',
        userId: 'user_demo_1',
        title: 'Integrate Gemini AI Smart Task Breakdown',
        description: 'Use Gemini 3.8 Flash to automatically decompose high-level goals into actionable subtasks.',
        status: 'todo',
        priority: 'medium',
        projectId: 'proj_1',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        estimatedHours: 8,
        actualHours: 0,
        tags: ['AI', 'Gemini', 'Productivity'],
        subtasks: [
          { id: 'sub_7', title: 'Define AI generation prompt schema', completed: true },
          { id: 'sub_8', title: 'Connect server-side @google/genai SDK', completed: true },
          { id: 'sub_9', title: 'Build AI assistant drawer in frontend', completed: false }
        ],
        comments: [],
        assignees: ['Alex Morgan'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_4',
        userId: 'user_demo_1',
        title: 'Perform security penetration test & audit',
        description: 'Verify CORS policies, JWT token expiration, and SQL/NoSQL injection prevention.',
        status: 'todo',
        priority: 'low',
        projectId: 'proj_3',
        dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
        estimatedHours: 10,
        actualHours: 0,
        tags: ['Security', 'DevOps'],
        subtasks: [
          { id: 'sub_10', title: 'Review dependency audit logs', completed: false },
          { id: 'sub_11', title: 'Test rate limiting on auth routes', completed: false }
        ],
        comments: [],
        assignees: ['Alex Morgan'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    fs.writeFileSync(TASKS_FILE, JSON.stringify(demoTasks, null, 2));
  }
}

initDb();

export const db = {
  getUsers: (): User[] => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')),
  saveUsers: (users: User[]) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)),
  
  getTasks: (): Task[] => JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')),
  saveTasks: (tasks: Task[]) => fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2)),

  getProjects: (): Project[] => JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8')),
  saveProjects: (projects: Project[]) => fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2)),
};
