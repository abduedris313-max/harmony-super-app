/**
 * @file FinanceWidget.tsx
 * @description iOS Smart Stack widget displaying live Net Worth, Cash Flow & Budget progress with S/M/L modes.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Wallet, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { getLocalItem, STORAGE_KEYS, INITIAL_OFFLINE_FINANCE_ACCOUNTS, INITIAL_OFFLINE_FINANCE_TRANSACTIONS, INITIAL_OFFLINE_FINANCE_BUDGETS } from '../../lib/offlinePersistence';
import { FinanceAccount, FinanceTransaction, FinanceBudget } from '../../apps/finance/types';
import { WidgetSize } from './types';
import { WidgetSizeSelector } from './WidgetSizeSelector';

interface FinanceWidgetProps {
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
  size?: WidgetSize;
  onResize?: (size: WidgetSize) => void;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({
  onOpenApp,
  isDarkMode = true,
  size = 'medium',
  onResize
}) => {
  const accounts = useMemo(() => {
    return getLocalItem<FinanceAccount[]>(STORAGE_KEYS.FINANCE_ACCOUNTS, INITIAL_OFFLINE_FINANCE_ACCOUNTS);
  }, []);

  const transactions = useMemo(() => {
    return getLocalItem<FinanceTransaction[]>(STORAGE_KEYS.FINANCE_TRANSACTIONS, INITIAL_OFFLINE_FINANCE_TRANSACTIONS);
  }, []);

  const budgets = useMemo(() => {
    return getLocalItem<FinanceBudget[]>(STORAGE_KEYS.FINANCE_BUDGETS, INITIAL_OFFLINE_FINANCE_BUDGETS);
  }, []);

  const netWorth = useMemo(() => {
    return accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  }, [accounts]);

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

  const topBudget = budgets[0] || { category: 'General', monthlyLimit: 500, alertThreshold: 80 };
  const spentInTopBudget = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    return transactions
      .filter(t => t.type === 'expense' && t.category === topBudget.category && t.date?.startsWith(currentMonthPrefix))
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions, topBudget]);

  const budgetPct = Math.min(100, Math.round((spentInTopBudget / (topBudget.monthlyLimit || 1)) * 100));

  const recentTransactions = useMemo(() => {
    return [...transactions].reverse().slice(0, 3);
  }, [transactions]);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`p-2.5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
        size === 'large' 
          ? 'min-h-[210px] sm:min-h-[230px]' 
          : size === 'medium'
            ? 'min-h-[96px] sm:min-h-[110px]'
            : 'min-h-[96px] sm:min-h-[110px]'
      } ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-emerald-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-emerald-400 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[10px] sm:text-[11px] tracking-wide">
          <Wallet className="w-3.5 h-3.5" />
          <span className="font-bold">FINANCE & LEDGER</span>
        </div>

        <div className="flex items-center gap-1.5">
          <WidgetSizeSelector size={size} onResize={onResize} isDarkMode={isDarkMode} />
          <button
            onClick={() => onOpenApp('harmony-finance')}
            className={`text-[10px] flex items-center gap-0.5 transition-colors font-medium ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Open <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ================= SMALL SIZE ================= */}
      {size === 'small' && (
        <>
          <div className="my-1">
            <span className="text-[8px] text-neutral-400 font-mono uppercase tracking-wider block">
              Net Worth
            </span>
            <p className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className={`px-1.5 py-1 rounded-lg border text-[8px] flex items-center justify-between ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <span className="text-neutral-400">Cash Flow:</span>
            <span className={`font-mono font-bold ${currentMonthCashFlow.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentMonthCashFlow.net >= 0 ? '+' : ''}${currentMonthCashFlow.net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </>
      )}

      {/* ================= MEDIUM SIZE ================= */}
      {size === 'medium' && (
        <>
          {/* Net Worth & Cash Flow Metrics */}
          <div className="my-1 flex items-center justify-between gap-1.5">
            <div>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 font-mono uppercase tracking-wider block">
                Net Worth
              </span>
              <p className={`text-sm sm:text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[8px] sm:text-[9px] text-neutral-400 font-mono uppercase tracking-wider block">
                Month Net
              </span>
              <div className="flex items-center justify-end gap-0.5 font-semibold text-[10px] sm:text-[11px]">
                {currentMonthCashFlow.net >= 0 ? (
                  <span className="text-emerald-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +${currentMonthCashFlow.net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    -${Math.abs(currentMonthCashFlow.net).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className={`px-2 py-1 rounded-lg border text-[9px] ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] mb-0.5">
              <span className={`font-semibold truncate ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                {topBudget.category} Budget
              </span>
              <span className="font-mono text-neutral-400 shrink-0">
                ${spentInTopBudget.toFixed(0)}/{topBudget.monthlyLimit} ({budgetPct}%)
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPct > 90 ? 'bg-rose-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* ================= LARGE SIZE ================= */}
      {size === 'large' && (
        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Net Worth</span>
              <p className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">
                ${netWorth.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Monthly Income</span>
              <p className="text-xs sm:text-sm font-black text-blue-400 mt-0.5">
                +${currentMonthCashFlow.income.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Monthly Spent</span>
              <p className="text-xs sm:text-sm font-black text-rose-400 mt-0.5">
                -${currentMonthCashFlow.expense.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Recent Ledger Entries */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 px-0.5">
              <span>Recent Transactions</span>
              <span className="text-[9px] text-neutral-400 font-mono">{transactions.length} Total</span>
            </div>

            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {tx.type === 'income' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{tx.title || tx.category}</p>
                    <p className="text-[8px] text-neutral-400">{tx.date}</p>
                  </div>
                </div>

                <span className={`font-mono font-bold shrink-0 ${
                  tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => onOpenApp('harmony-finance')}
            className={`w-full py-1 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors ${
              isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            <Plus className="w-3 h-3" /> Record Transaction
          </button>
        </div>
      )}
    </motion.div>
  );
};
