import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'AI_STUDIO_INJECTED_KEY',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Smart Task Breakdown
router.post('/breakdown', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { taskTitle, taskDescription } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: 'Task title is required for AI breakdown.' });
    }

    const prompt = `Deconstruct this task into 3 to 6 actionable subtasks, estimate total hours (number), and suggest 2-3 relevant tags and priority (low, medium, high, urgent). Task Title: "${taskTitle}". Description: "${taskDescription || ''}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of clear, actionable subtasks'
            },
            estimatedHours: {
              type: Type.NUMBER,
              description: 'Estimated hours to complete the task'
            },
            suggestedPriority: {
              type: Type.STRING,
              description: 'Suggested priority: low, medium, high, or urgent'
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relevant categorical tags'
            }
          },
          required: ['subtasks', 'estimatedHours', 'suggestedPriority', 'tags']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (err: any) {
    console.error('AI Breakdown Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI task breakdown.' });
  }
});

// AI Productivity Coach & Assistant
router.post('/coach', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userQuery, taskSummary } = req.body;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery || 'Provide a brief productivity summary and prioritization advice.',
      config: {
        systemInstruction: `You are TaskFlow AI, an expert enterprise project management coach and productivity assistant. Current task overview context: ${JSON.stringify(taskSummary || {})}. Give actionable, concise, and professional guidance.`,
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('AI Coach Error:', err);
    res.status(500).json({ error: err.message || 'Failed to get AI coach response.' });
  }
});

export default router;
