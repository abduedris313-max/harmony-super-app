/**
 * @file BudgetingView.tsx
 * @description Smart monthly budgeting engine with category progress indicators, threshold alerts, and budget planner.
 */

import React, { useState } from 'react';
import { 
  PieChart, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { FinanceBudget, FinanceTransaction, FinanceCategory } from '../types';
import { calculateBudgetStatus, formatCurrency } from '../lib/calculations';

interface BudgetingViewProps {
  budgets: FinanceBudget[];
  transactions: FinanceTransaction[];
  currencyCode: string;
  onSaveBudget: (budget: Partial<FinanceBudget> & { id: string; category: FinanceCategory; monthlyLimit: number }) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
}

const CATEGORIES: FinanceCategory[] = [
  'Housing',
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities',
  'Health & Medical',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Subscriptions',
  'Other'
];

export const BudgetingView: React.FC<BudgetingViewProps> = ({
  budgets,
  transactions,
  currencyCode,
  onSaveBudget,
  onDeleteBudget
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<FinanceBudget | null>(null);
  const [category, setCategory] = useState<FinanceCategory>('Food & Dining');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const budgetStatuses = calculateBudgetStatus(budgets, transactions);

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalBudgetSpent = budgetStatuses.reduce((sum, b) => sum + b.spent, 0);
  const totalBudgetRemaining = totalBudgetLimit - totalBudgetSpent;
  const overallPercentage = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  const handleOpenAdd = () => {
    setBudgetToEdit(null);
    setCategory('Food & Dining');
    setMonthlyLimit('500');
    setAlertThreshold('80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: FinanceBudget) => {
    setBudgetToEdit(b);
    setCategory(b.category);
    setMonthlyLimit(b.monthlyLimit.toString());
    setAlertThreshold((b.alertThreshold || 80).toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) return;

    await onSaveBudget({
      id: budgetToEdit ? budgetToEdit.id : `budget-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      category,
      monthlyLimit: limit,
      alertThreshold: parseInt(alertThreshold, 10) || 80,
      currency: currencyCode,
      createdAt: budgetToEdit ? budgetToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 text-white">
      {/* Overall Budget Overview Card */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#1c2230] via-[#161b22] to-[#0f131a] border border-[#30363d] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b949e]">
              Monthly Category Budget Gauge
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {formatCurrency(totalBudgetSpent, currencyCode)}{' '}
              <span className="text-sm font-normal text-[#8b949e]">
                of {formatCurrency(totalBudgetLimit, currencyCode)} limit
              </span>
            </h2>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Category Budget</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 my-3">
          <div className="flex justify-between text-xs font-mono">
            <span className={overallPercentage > 100 ? 'text-rose-400 font-bold' : 'text-indigo-300'}>
              {overallPercentage}% Utilized
            </span>
            <span className={totalBudgetRemaining >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {totalBudgetRemaining >= 0 ? '+' : ''}{formatCurrency(totalBudgetRemaining, currencyCode)} Remaining
            </span>
          </div>

          <div className="w-full h-3 bg-[#0d1117] rounded-full overflow-hidden p-0.5 border border-[#30363d]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage > 100 ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                overallPercentage > 80 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#30363d]/60 text-center">
          <div>
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Planned</span>
            <p className="text-xs font-bold font-mono text-white mt-0.5">{formatCurrency(totalBudgetLimit, currencyCode)}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Actual Spent</span>
            <p className="text-xs font-bold font-mono text-rose-400 mt-0.5">{formatCurrency(totalBudgetSpent, currencyCode)}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Available</span>
            <p className="text-xs font-bold font-mono text-emerald-400 mt-0.5">{formatCurrency(Math.max(0, totalBudgetRemaining), currencyCode)}</p>
          </div>
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {budgetStatuses.length > 0 ? (
          budgetStatuses.map((status) => {
            const rawBudget = budgets.find(b => b.category === status.category);
            return (
              <div
                key={status.category}
                className={`p-4 rounded-2xl border transition-all shadow-sm flex flex-col justify-between ${
                  status.isOverBudget
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : status.percentageUsed >= status.alertThreshold
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-[#161b22] border-[#30363d]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        status.isOverBudget ? 'bg-rose-500/20 text-rose-400' :
                        status.percentageUsed >= status.alertThreshold ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {status.isOverBudget ? '!' : '✓'}
                      </div>
                      <h4 className="text-sm font-bold text-white">{status.category}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      {rawBudget && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(rawBudget)}
                            className="p-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors text-xs"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteBudget(rawBudget.id)}
                            className="p-1 rounded-lg bg-[#21262d] hover:bg-rose-500/20 text-[#8b949e] hover:text-rose-400 transition-colors text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between my-2 text-xs font-mono">
                    <span className="text-white font-bold text-sm">
                      {formatCurrency(status.spent, currencyCode)}
                    </span>
                    <span className="text-[#8b949e]">
                      limit: {formatCurrency(status.budgetLimit, currencyCode)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status.isOverBudget ? 'bg-rose-500' :
                        status.percentageUsed >= status.alertThreshold ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(status.percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 mt-3 border-t border-[#30363d]/60">
                  <span className={status.isOverBudget ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
                    {status.isOverBudget ? `Over by ${formatCurrency(Math.abs(status.remaining), currencyCode)}` : `${formatCurrency(status.remaining, currencyCode)} left`}
                  </span>
                  <span className="font-mono text-[#8b949e]">
                    {status.percentageUsed}%
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sm:col-span-2 p-12 text-center text-[#8b949e] rounded-2xl bg-[#161b22] border border-[#30363d]">
            <PieChart className="w-10 h-10 mx-auto text-[#8b949e]/40 mb-3" />
            <h4 className="text-sm font-bold text-white">No Category Budgets Configured</h4>
            <p className="text-xs text-[#8b949e] mt-1">Set monthly category spending limits to gain full control over your finances.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              + Create Category Budget
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] text-white rounded-2xl w-full max-w-md p-4 space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-sm font-bold text-white">
              {budgetToEdit ? 'Edit Budget Plan' : 'Create Category Budget'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FinanceCategory)}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Monthly Spending Limit ({currencyCode})</label>
                <input
                  type="number"
                  step="1"
                  required
                  min="1"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  placeholder="500"
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  placeholder="80"
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                />
                <span className="text-[10px] text-[#8b949e] mt-1 block">
                  Notify when spending reaches {alertThreshold}% of limit.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
