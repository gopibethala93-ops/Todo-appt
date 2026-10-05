import { Router } from 'express';
import { db, Task, Project } from '../storage/db';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all tasks (with optional filtering by project, status, priority, search)
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { projectId, status, priority, search } = req.query;
    let tasks = db.getTasks();

    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, projectId, dueDate, estimatedHours, tags, assignees, subtasks } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required.' });
    }

    const tasks = db.getTasks();
    const newTask: Task = {
      id: 'task_' + Date.now(),
      userId: req.user!.id,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      projectId,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      estimatedHours: estimatedHours ? Number(estimatedHours) : 4,
      actualHours: 0,
      tags: tags || [],
      subtasks: (subtasks || []).map((s: any, idx: number) => ({
        id: 'sub_' + Date.now() + '_' + idx,
        title: typeof s === 'string' ? s : s.title,
        completed: typeof s === 'object' ? !!s.completed : false
      })),
      comments: [],
      assignees: assignees || ['Alex Morgan'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    db.saveTasks(tasks);
    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create task' });
  }
});

// Update task
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const tasks = db.getTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const task = tasks[index];
    const updates = req.body;

    const updatedTask: Task = {
      ...task,
      ...updates,
      id: task.id, // prevent id override
      userId: task.userId,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    db.saveTasks(tasks);
    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    let tasks = db.getTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    db.saveTasks(tasks);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete task' });
  }
});

// Add comment to task
router.post('/:id/comments', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Comment content is required.' });
    }

    const tasks = db.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const users = db.getUsers();
    const user = users.find(u => u.id === req.user?.id);

    const newComment = {
      id: 'com_' + Date.now(),
      userId: req.user!.id,
      userName: user ? user.name : 'Team Member',
      content,
      createdAt: new Date().toISOString()
    };

    task.comments.push(newComment);
    task.updatedAt = new Date().toISOString();
    db.saveTasks(tasks);

    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add comment' });
  }
});

// Get Projects
router.get('/projects/all', authenticateToken, (req: AuthRequest, res) => {
  try {
    const projects = db.getProjects();
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch projects' });
  }
});

// Create Project
router.post('/projects', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    const projects = db.getProjects();
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      userId: req.user!.id,
      name,
      description: description || '',
      color: color || '#3b82f6',
      createdAt: new Date().toISOString()
    };

    projects.push(newProj);
    db.saveProjects(projects);
    res.status(201).json(newProj);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create project' });
  }
});

export default router;
