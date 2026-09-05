/**
 * @file ExpenseTrackerView.tsx
 * @description Interactive Expense & Income Ledger tracker with search, category filtering, and CSV export.
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  Tag,
  Calendar,
  Wallet
} from 'lucide-react';
import { FinanceTransaction, FinanceAccount, FinanceCategory, TransactionType } from '../types';
import { formatCurrency, exportTransactionsToCsv, downloadFile } from '../lib/calculations';

interface ExpenseTrackerViewProps {
  transactions: FinanceTransaction[];
  accounts: FinanceAccount[];
  currencyCode: string;
  onOpenAddModal: (type?: TransactionType) => void;
  onEditTransaction: (tx: FinanceTransaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const ExpenseTrackerView: React.FC<ExpenseTrackerViewProps> = ({
  transactions,
  accounts,
  currencyCode,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [dateMonthFilter, setDateMonthFilter] = useState<string>('');

  // Extract unique categories and months
  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category));
    return Array.from(set);
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (accountFilter !== 'all' && t.accountId !== accountFilter) return false;
      if (dateMonthFilter && !t.date.startsWith(dateMonthFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesNotes = (t.notes || '').toLowerCase().includes(q);
        const matchesTags = (t.tags || []).some(tag => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesNotes && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, categoryFilter, accountFilter, dateMonthFilter, searchQuery]);

  // Financial sums of filtered set
  const filteredSummary = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return { expenses, income, net: income - expenses };
  }, [filteredTransactions]);

  const handleExportCsv = () => {
    const csvData = exportTransactionsToCsv(filteredTransactions);
    downloadFile(csvData, `harmony-finance-ledger-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  const getAccountName = (accId: string) => {
    return accounts.find(a => a.id === accId)?.name || 'Standard Account';
  };

  return (
    <div className="space-y-4 text-neutral-900 dark:text-white">
      {/* Header Controls & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Transactions & Ledger ({filteredTransactions.length})</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#21262d] hover:bg-neutral-200 dark:hover:bg-[#30363d] text-neutral-700 dark:text-[#c9d1d9] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-200 dark:border-transparent"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onOpenAddModal('expense')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Transaction</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400 dark:text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, notes, or #tags..."
              className="w-full bg-neutral-50 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Pills & Month Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-200 dark:border-[#30363d]/60 text-xs">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0d1117] p-0.5 rounded-lg border border-neutral-200 dark:border-[#30363d]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${typeFilter === 'all' ? 'bg-white dark:bg-[#21262d] text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${typeFilter === 'expense' ? 'bg-rose-600 text-white' : 'text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white'}`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${typeFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white'}`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('transfer')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${typeFilter === 'transfer' ? 'bg-blue-600 text-white' : 'text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white'}`}
            >
              Transfers
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{formatCurrency(filteredSummary.income, currencyCode)}</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">-{formatCurrency(filteredSummary.expenses, currencyCode)}</span>
            <span className={`font-bold ${filteredSummary.net >= 0 ? 'text-indigo-600 dark:text-indigo-300' : 'text-rose-600 dark:text-rose-300'}`}>
              Net: {formatCurrency(filteredSummary.net, currencyCode)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="space-y-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] hover:border-indigo-400 dark:hover:border-[#58a6ff]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                  tx.type === 'expense' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                  tx.type === 'income' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                  'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                }`}>
                  {tx.type === 'expense' ? '↓' : tx.type === 'income' ? '↑' : '⇄'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{tx.title}</h4>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-100 dark:bg-[#21262d] text-neutral-600 dark:text-[#8b949e] font-medium border border-neutral-200 dark:border-[#30363d]">
                      {tx.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 dark:text-[#8b949e] mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{getAccountName(tx.accountId)}</span>
                    {tx.toAccountId && (
                      <span>➔ {getAccountName(tx.toAccountId)}</span>
                    )}
                    {tx.notes && (
                      <>
                        <span>•</span>
                        <span className="italic text-neutral-700 dark:text-[#c9d1d9] line-clamp-1 max-w-[200px]">{tx.notes}</span>
                      </>
                    )}
                  </p>

                  {tx.tags && tx.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tx.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-100 dark:border-transparent">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className={`text-base font-bold font-mono ${
                    tx.type === 'expense' ? 'text-rose-600 dark:text-rose-400' :
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                    {formatCurrency(tx.amount, currencyCode)}
                  </span>
                  <p className="text-[10px] text-neutral-500 dark:text-[#8b949e] capitalize">{tx.paymentMethod.replace('_', ' ')}</p>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditTransaction(tx)}
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-[#21262d] hover:bg-neutral-200 dark:hover:bg-[#30363d] text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="Edit transaction"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-[#21262d] hover:bg-rose-500/20 text-neutral-500 dark:text-[#8b949e] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-neutral-500 dark:text-[#8b949e] rounded-2xl bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] shadow-xs">
            <Wallet className="w-10 h-10 mx-auto text-neutral-400 dark:text-[#8b949e]/40 mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">No transactions recorded</h4>
            <p className="text-xs text-neutral-500 dark:text-[#8b949e] mt-1">Start tracking your cash flow by recording your first expense or income.</p>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
            >
              + Record Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
