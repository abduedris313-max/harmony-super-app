/**
 * @file HarmonyDocsAiApp.tsx
 * @description Built-in Native implementation of Harmony Docs AI mini app powered by Gemini 2.5 AI & Firebase sync.
 */

import React, { useState } from 'react';
import { Sparkles, Send, FileText, Bot, User, RefreshCw, Copy, Check, MessageSquare } from 'lucide-react';
import { HarmonyAiChat, SystemUser } from '../../types';

interface HarmonyDocsAiAppProps {
  user: SystemUser | null;
  aiChats: HarmonyAiChat[];
  onSaveAiChat: (chat: Partial<HarmonyAiChat> & { id: string }) => Promise<any>;
}

export const HarmonyDocsAiApp: React.FC<HarmonyDocsAiAppProps> = ({
  user,
  aiChats,
  onSaveAiChat
}) => {
  const [docContext, setDocContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am Harmony AI, your Gemini copilot. Paste any document or text above, and ask me to summarize, extract insights, rephrase, or answer questions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = [
    { label: 'Summarize Document', taskType: 'summarize', prompt: 'Summarize this document with key executive bullet points.' },
    { label: 'Polish & Refine', taskType: 'writing-assistant', prompt: 'Polish and refine the tone, grammar, and flow of this text.' },
    { label: 'Extract Key Points', taskType: 'general', prompt: 'List top 5 key takeaways and action items from this document.' },
    { label: 'Generate Outline', taskType: 'general', prompt: 'Create a structured outline based on this content.' }
  ];

  const handleSend = async (userPromptText?: string, taskType?: string) => {
    const textToSend = userPromptText || prompt;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!userPromptText) setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/harmony/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: docContext,
          taskType: taskType || 'general'
        })
      });

      const data = await res.json();
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant' as const,
        text: data.text || 'No response returned from Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Save chat log to Firebase
      if (user) {
        await onSaveAiChat({
          id: `ai-chat-${Date.now()}`,
          docTitle: docContext.slice(0, 30) || 'General AI Query',
          messages: finalMessages
        });
      }
    } catch (err: any) {
      console.error('Gemini AI API Error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Sorry, I encountered an issue connecting to Gemini AI. Please check your network or server configuration.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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
    <div id="harmony-docs-ai-container" className="flex-1 w-full flex flex-col md:flex-row bg-neutral-950 text-white overflow-hidden">
      {/* Left Column - Document Context Input */}
      <div className="w-full md:w-80 bg-neutral-900/80 border-r border-neutral-800 p-4 flex flex-col h-full overflow-hidden">
        <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4" />
          <span>Document Context</span>
        </h3>
        
        <textarea
          value={docContext}
          onChange={(e) => setDocContext(e.target.value)}
          placeholder="Paste document text or notes here to give Harmony AI full context..."
          className="flex-1 w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none leading-relaxed mb-4"
        />

        {/* Preset AI Prompts */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Quick AI Actions</span>
          <div className="grid grid-cols-1 gap-1.5">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p.prompt, p.taskType)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Interactive AI Chat */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 p-6 overflow-hidden">
        <div className="pb-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-base text-white">Gemini 2.5 AI Assistant</h4>
          </div>
          <span className="text-xs text-purple-300/80 font-mono px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
            Firebase Synced
          </span>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${m.sender === 'user' ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-3xl text-sm leading-relaxed border relative group ${m.sender === 'user' ? 'bg-purple-600/30 text-white border-purple-500/30 rounded-tr-none' : 'bg-neutral-900 text-white/90 border-neutral-800 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-40">
                  <span>{m.timestamp}</span>
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="hover:opacity-100 flex items-center gap-1 ml-4"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-purple-300 text-xs py-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini is generating response...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask Gemini AI anything about your document..."
            className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-white/30"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !prompt.trim()}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
