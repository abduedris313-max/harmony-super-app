/**
 * @file FinanceWidget.tsx
 * @description iOS Smart Stack widget displaying live Net Worth, Cash Flow & Budget progress.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Wallet, ChevronRight, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react';
import { getLocalItem, STORAGE_KEYS, INITIAL_OFFLINE_FINANCE_ACCOUNTS, INITIAL_OFFLINE_FINANCE_TRANSACTIONS, INITIAL_OFFLINE_FINANCE_BUDGETS } from '../../lib/offlinePersistence';
import { FinanceAccount, FinanceTransaction, FinanceBudget } from '../../apps/finance/types';

interface FinanceWidgetProps {
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({
  onOpenApp,
  isDarkMode = true,
}) => {
  // Read synced finance data from offline store
  const accounts = useMemo(() => {
    return getLocalItem<FinanceAccount[]>(STORAGE_KEYS.FINANCE_ACCOUNTS, INITIAL_OFFLINE_FINANCE_ACCOUNTS);
  }, []);

  const transactions = useMemo(() => {
    return getLocalItem<FinanceTransaction[]>(STORAGE_KEYS.FINANCE_TRANSACTIONS, INITIAL_OFFLINE_FINANCE_TRANSACTIONS);
  }, []);

  const budgets = useMemo(() => {
    return getLocalItem<FinanceBudget[]>(STORAGE_KEYS.FINANCE_BUDGETS, INITIAL_OFFLINE_FINANCE_BUDGETS);
  }, []);

  // Compute Net Worth
  const netWorth = useMemo(() => {
    return accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  }, [accounts]);

  // Compute current month cash flow
  const currentMonthCashFlow = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.date?.startsWith(currentMonthPrefix)) {
        if (t.type === 'income') income += (t.amount || 0);
        if (t.type === 'expense') expense += (t.amount || 0);
      }
    });

    return {
      income,
      expense,
      net: income - expense
    };
  }, [transactions]);

  // Top active budget category
  const topBudget = budgets[0] || { category: 'General', monthlyLimit: 500, alertThreshold: 80 };
  const spentInTopBudget = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    return transactions
      .filter(t => t.type === 'expense' && t.category === topBudget.category && t.date?.startsWith(currentMonthPrefix))
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions, topBudget]);

  const budgetPct = Math.min(100, Math.round((spentInTopBudget / (topBudget.monthlyLimit || 1)) * 100));

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-emerald-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-emerald-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px] tracking-wide">
          <Wallet className="w-3.5 h-3.5" />
          <span>FINANCE & LEDGER</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-finance')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Open <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Net Worth & Cash Flow Metrics */}
      <div className="my-1 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">
            Total Net Worth
          </span>
          <p className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">
            Month Net Flow
          </span>
          <div className="flex items-center justify-end gap-1 font-semibold text-xs">
            {currentMonthCashFlow.net >= 0 ? (
              <span className="text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +${currentMonthCashFlow.net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                -${Math.abs(currentMonthCashFlow.net).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className={`p-2 rounded-xl border text-[11px] ${
        isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className={`font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {topBudget.category} Budget
          </span>
          <span className="font-mono text-neutral-400">
            ${spentInTopBudget.toFixed(0)} / ${topBudget.monthlyLimit} ({budgetPct}%)
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPct > 85 ? 'bg-rose-500' : budgetPct > 65 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
