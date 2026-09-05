import React from 'react';
import { Sparkles, Send, Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { useTheme } from '../../../hooks/useTheme';

interface ChatConsoleProps {
  messages: ChatMessage[];
  prompt: string;
  setPrompt: (text: string) => void;
  isLoading: boolean;
  copiedId: string | null;
  onSend: (customPrompt?: string) => void;
  onCopy: (id: string, text: string) => void;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
  prompt,
  setPrompt,
  isLoading,
  copiedId,
  onSend,
  onCopy,
}) => {
  const theme = useTheme();

  return (
    <div className="flex-1 flex flex-col md:h-full bg-neutral-50 dark:bg-[#0d1117] p-4 sm:p-6 overflow-hidden min-h-[450px] md:min-h-0">
      {/* Console Header */}
      <div className="pb-3 border-b border-neutral-200 dark:border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-bold text-base text-neutral-900 dark:text-white">Gemini 2.5 AI Assistant</h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40">
          Powered by @google/genai
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none min-h-0">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isUser ? 'bg-purple-600 text-white' : 'bg-white dark:bg-[#161b22] text-purple-600 dark:text-purple-400 border border-neutral-200 dark:border-[#30363d] shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed border relative group ${
                  isUser
                    ? 'bg-purple-600/90 text-white border-purple-500/30 rounded-tr-none max-w-[85%]'
                    : 'bg-white dark:bg-[#161b22] text-neutral-800 dark:text-[#c9d1d9] border-neutral-200 dark:border-[#30363d] rounded-tl-none max-w-[90%] shadow-xs'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{m.text}</p>
                ) : (
                  <div className="prose dark:prose-invert prose-sm max-w-none text-neutral-800 dark:text-[#c9d1d9]">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 dark:text-[#8b949e]">
                  <span>{m.timestamp}</span>
                  <button
                    onClick={() => onCopy(m.id, m.text)}
                    className="hover:text-purple-600 dark:hover:text-purple-300 p-1 transition-colors"
                    title="Copy Message"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-[#161b22] text-purple-600 dark:text-purple-400 border border-neutral-200 dark:border-[#30363d]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-xs text-neutral-500 dark:text-[#8b949e] animate-pulse">
              Gemini AI is analyzing document context...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-neutral-200 dark:border-[#30363d] flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          placeholder="Ask Gemini AI anything about your document..."
          className="flex-1 bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-neutral-900 dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-neutral-400 dark:placeholder-[#8b949e] shadow-xs"
        />
        <button
          onClick={() => onSend()}
          disabled={isLoading || !prompt.trim()}
          className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
