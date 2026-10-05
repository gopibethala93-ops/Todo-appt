import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './backend/src/routes/auth.routes';
import tasksRoutes from './backend/src/routes/tasks.routes';
import aiRoutes from './backend/src/routes/ai.routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', tasksRoutes);
  app.use('/api/ai', aiRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Setup Vite middleware in development or static serve in production
  if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_HMR !== undefined || true) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.log('Vite middleware setup notice:', e);
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`TaskFlow Pro MERN Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
