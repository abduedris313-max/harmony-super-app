/**
 * @file server.ts
 * @description Production-grade Express + Vite server backend for Harmony OS Super App.
 * Handles API endpoints, Gemini AI integration, app metadata, and SPA asset serving.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google Gemini AI SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set on the server.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Harmony OS Super App Backend',
    firebaseProject: 'concrete-lead-kc9s2'
  });
});

/**
 * Get catalog of integrated Harmony Mini Apps
 */
app.get('/api/harmony/apps', (_req: Request, res: Response) => {
  const apps = [
    {
      id: 'harmony-notes',
      name: 'Harmony Notes',
      tagline: 'Smart Notes & Category Organizers',
      icon: 'notebook',
      color: 'from-amber-400 to-orange-500',
      deployedUrl: 'https://abduedris313-max.github.io/harmony-notes/',
      repoUrl: 'https://github.com/abduedris313-max/harmony-notes',
      description: 'Capture quick thoughts, bullet points, voice memos, and tagged categories.',
      badge: 'Notes'
    },
    {
      id: 'harmony-docs',
      name: 'Harmony Docs',
      tagline: 'Rich Text Workspace & Documents',
      icon: 'file-text',
      color: 'from-blue-500 to-indigo-600',
      deployedUrl: 'https://abduedris313-max.github.io/harmony-docs/',
      repoUrl: 'https://github.com/abduedris313-max/harmony-docs',
      description: 'Collaborative document editing, word counting, formatting, and exported PDFs.',
      badge: 'Docs'
    },
    {
      id: 'harmony-writing',
      name: 'Harmony Writing',
      tagline: 'Focus Studio & Daily Word Target',
      icon: 'pen-tool',
      color: 'from-emerald-400 to-teal-600',
      deployedUrl: 'https://abduedris313-max.github.io/harmony-writing/',
      repoUrl: 'https://github.com/abduedris313-max/harmony-writing',
      description: 'Distraction-free typewriter environment, soundscapes, ambient timers, and stats.',
      badge: 'Studio'
    },
    {
      id: 'harmony-music-player',
      name: 'Harmony Music',
      tagline: 'Hi-Fi Playlists & Audio Synth',
      icon: 'disc',
      color: 'from-fuchsia-500 to-rose-600',
      deployedUrl: 'https://abduedris313-max.github.io/harmony-music-player/',
      repoUrl: 'https://github.com/abduedris313-max/harmony-music-player',
      description: 'iOS style Music Player with ambient streams, custom playlists, equalizer, and background mode.',
      badge: 'Audio'
    },
    {
      id: 'harmony-docs-ai',
      name: 'Harmony Docs AI',
      tagline: 'Gemini Document Intelligence & Copilot',
      icon: 'sparkles',
      color: 'from-violet-500 to-purple-700',
      deployedUrl: 'https://abduedris313-max.github.io/harmony-docs-ai/',
      repoUrl: 'https://github.com/abduedris313-max/harmony-docs-ai',
      description: 'Ask questions, summarize long documents, generate outlines, and refine draft prose.',
      badge: 'AI'
    }
  ];

  res.json({ apps });
});

/**
 * Gemini AI Proxy endpoint for Harmony Super App
 */
app.post('/api/harmony/ai', async (req: Request, res: Response) => {
  try {
    const { prompt, context, taskType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    let systemInstruction = 'You are Harmony AI, the super intelligent copilot built into Harmony OS. Provide concise, elegant, structured output.';
    if (taskType === 'summarize') {
      systemInstruction = 'Analyze and summarize the provided document into key takeaways, executive summary, and action items.';
    } else if (taskType === 'writing-assistant') {
      systemInstruction = 'Refine, polish, expand or format the text to elevate literary quality, style, and flow.';
    } else if (taskType === 'music-recommend') {
      systemInstruction = 'Suggest music genres, BPMs, or track playlists matching the user mood or writing document context.';
    }

    const fullPrompt = context
      ? `[Context document / content]:\n${context}\n\n[User prompt]:\n${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      text: response.text || 'No response returned from Gemini.',
      model: 'gemini-2.5-flash'
    });
  } catch (error: any) {
    console.error('[Harmony AI Backend Error]:', error);
    res.status(500).json({
      error: error.message || 'Failed to process request with Gemini AI'
    });
  }
});

// -----------------------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Harmony OS Super App] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
