/**
 * @file FinanceAiAdvisorView.tsx
 * @description Gemini AI Financial Copilot & Advisory Studio.
 * Generates personalized spending diagnostics, debt payoff strategies, and savings plans.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import Markdown from 'react-markdown';
import { 
  FinanceTransaction, 
  FinanceAccount, 
  FinanceLoan, 
  FinanceBudget, 
  FinanceSubscription 
} from '../types';
import { 
  calculateNetWorth, 
  calculateMonthlyCashFlow, 
  calculateBudgetStatus, 
  formatCurrency 
} from '../lib/calculations';

interface FinanceAiAdvisorViewProps {
  transactions: FinanceTransaction[];
  accounts: FinanceAccount[];
  loans: FinanceLoan[];
  budgets: FinanceBudget[];
  subscriptions: FinanceSubscription[];
  currencyCode: string;
}

interface AiFinancialMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FinanceAiAdvisorView: React.FC<FinanceAiAdvisorViewProps> = ({
  transactions,
  accounts,
  loans,
  budgets,
  subscriptions,
  currencyCode
}) => {
  const [messages, setMessages] = useState<AiFinancialMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `👋 Hello! I am your **Harmony AI Financial Copilot**.\n\nI have real-time access to your ledger, monthly cash flow, category budgets, active loans, and subscriptions.\n\nHere are some things I can assist you with:\n- 📊 **Audit Monthly Spending**: Identify discretionary leakage and optimize subscriptions.\n- 🏔️ **Debt Freedom Roadmap**: Formulate an accelerated payoff plan (Snowball vs. Avalanche).\n- 🎯 **50/30/20 Budget Diagnostic**: Assess Needs, Wants, and Savings allocation.\n- 🛡️ **Emergency Fund Strategy**: Calculate your 3–6 month safety runway based on fixed expenses.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Financial Context Bundle for Gemini AI
  const prepareFinancialContext = () => {
    const { totalAssets, totalLiabilities, netWorth } = calculateNetWorth(accounts, loans);
    const cashFlow = calculateMonthlyCashFlow(transactions);
    const budgetStatuses = calculateBudgetStatus(budgets, transactions);

    const activeLoans = loans.filter(l => l.status === 'active');
    const activeSubs = subscriptions.filter(s => s.status === 'active');

    return JSON.stringify({
      currency: currencyCode,
      netWorthMetrics: {
        totalAssets,
        totalLiabilities,
        netWorth
      },
      monthlyCashFlow: {
        totalIncome: cashFlow.totalIncome,
        totalExpenses: cashFlow.totalExpenses,
        netSavings: cashFlow.netSavings,
        savingsRate: `${cashFlow.savingsRate}%`
      },
      budgetsStatus: budgetStatuses.map(b => ({
        category: b.category,
        limit: b.budgetLimit,
        spent: b.spent,
        percentUsed: `${b.percentageUsed}%`,
        isOver: b.isOverBudget
      })),
      activeLoans: activeLoans.map(l => ({
        title: l.title,
        principal: l.originalPrincipal,
        currentBalance: l.currentBalance,
        interestRateAPR: `${l.interestRate}%`,
        monthlyEmi: l.monthlyEmi
      })),
      subscriptions: activeSubs.map(s => ({
        name: s.name,
        amount: s.amount,
        cycle: s.billingCycle
      }))
    }, null, 2);
  };

  const handleSendMessage = async (userPromptText?: string) => {
    const queryText = (userPromptText || prompt).trim();
    if (!queryText || isLoading) return;

    const userMessage: AiFinancialMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const contextData = prepareFinancialContext();
      const response = await fetch('/api/harmony/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          context: `Current User Financial State (Live Snapshot):\n${contextData}`,
          taskType: 'financial-advisor'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: AiFinancialMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: data.text || 'Unable to generate financial advice at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: AiFinancialMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        text: `⚠️ **AI Advisor Offline**: ${err.message || 'Please verify network connection.'}\n\n*Tip: All your financial ledger and loan calculations continue to run with full offline capability.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_PROMPTS = [
    { label: '📊 Monthly Spending Audit', prompt: 'Audit my current monthly expenses, identify budget leakages, and suggest 3 high-impact areas to reduce costs.' },
    { label: '🏔️ Debt Payoff Strategy', prompt: 'Analyze my active loans and debts. Recommend whether I should use Debt Avalanche or Debt Snowball, and calculate estimated payoff timelines.' },
    { label: '🎯 50/30/20 Budget Check', prompt: 'Evaluate my spending against the 50/30/20 rule (50% Needs, 30% Wants, 20% Savings/Debt) and provide a score.' },
    { label: '🛡️ Emergency Fund Plan', prompt: 'Calculate my minimum 3-month and 6-month emergency fund target based on my fixed expenses, and create a realistic monthly savings timeline.' }
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px] text-white space-y-3">
      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-indigo-500 text-[11px] font-medium text-[#c9d1d9] hover:text-white shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 overflow-y-auto space-y-3 scrollbar-none text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 space-y-1 shadow-sm relative group ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[10px] font-semibold text-[#8b949e]">
                  {msg.sender === 'user' ? 'You' : 'Harmony Financial AI'}
                </span>
                <span className="text-[9px] text-[#8b949e] font-mono">{msg.timestamp}</span>
              </div>

              {msg.sender === 'assistant' ? (
                <div className="markdown-body prose prose-invert max-w-none text-xs leading-relaxed space-y-2">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              )}

              {msg.sender === 'assistant' && (
                <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="text-[10px] text-[#8b949e] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e] shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2 bg-[#0d1117] rounded-xl border border-[#30363d] w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing financial models & generating strategy...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-2 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask AI Financial Advisor (e.g. 'How much can I save if I cut dining by 20%?')..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!prompt.trim() || isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
