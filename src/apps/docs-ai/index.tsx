import React, { useState } from 'react';
import { ContextSidebar } from './components/ContextSidebar';
import { ChatConsole } from './components/ChatConsole';
import { ChatMessage, AiPresetPrompt } from './types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    text: `Hello! I am **Harmony Gemini 2.5 AI**. 

I can help you summarize document contents, extract key action items, translate text, or answer questions based on the context provided in the left sidebar.`,
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const PRESETS: AiPresetPrompt[] = [
  {
    id: 'p-1',
    title: '📝 Summarize Key Highlights',
    promptText: 'Please provide a bulleted summary of the main key takeaways from the document context.',
    category: 'summarize',
  },
  {
    id: 'p-2',
    title: '✅ Extract Action Items',
    promptText: 'Identify and list all actionable tasks, deliverables, and assignments mentioned in the document context.',
    category: 'action-items',
  },
  {
    id: 'p-3',
    title: '✨ Improve Clarity & Tone',
    promptText: 'Review the provided text and suggest improvements for grammar, flow, and professional tone.',
    category: 'grammar',
  },
  {
    id: 'p-4',
    title: '💡 Generate FAQ Section',
    promptText: 'Based on this document, create 3 frequently asked questions and answers.',
    category: 'expand',
  },
];

export const HarmonyDocsAiAppModule: React.FC = () => {
  const [docContext, setDocContext] = useState(
    `Harmony OS is an Apple iOS 18 inspired Super App platform.
It features dynamic island widgets, control center, native dark theme, and dual execution runtimes.
Key features include Notes with tags, Docs with markdown export, Typewriter studio with sound synthesizer, Lo-Fi music player with Solfeggio frequencies, and Gemini 2.5 AI Assistant.`
  );
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setIsLoading(true);

    try {
      // Call Gemini API via server endpoint
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: docContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          text: data.text || 'No response generated.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }
    } catch (err: any) {
      const fallbackAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: `⚠️ **Unable to connect to Gemini AI Assistant**: ${err.message || 'Please check your connection.'}\n\n*Your documents and context remain safely stored locally.*`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="harmony-docs-ai-container"
      className="flex-1 w-full flex flex-col md:flex-row bg-[#0d1117] text-[#c9d1d9] min-h-0 overflow-y-auto md:overflow-hidden"
    >
      <ContextSidebar
        docContext={docContext}
        setDocContext={setDocContext}
        presets={PRESETS}
        onTriggerPreset={(promptText) => handleSend(promptText)}
      />
      <ChatConsole
        messages={messages}
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        copiedId={copiedId}
        onSend={handleSend}
        onCopy={handleCopy}
      />
    </div>
  );
};

export default HarmonyDocsAiAppModule;
