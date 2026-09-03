/**
 * @file SubscriptionsView.tsx
 * @description Recurring Subscriptions, Memberships & Utility Bills Manager.
 */

import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  DollarSign,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { FinanceSubscription, FinanceAccount, FinanceCategory, BillingCycle } from '../types';
import { formatCurrency } from '../lib/calculations';

interface SubscriptionsViewProps {
  subscriptions: FinanceSubscription[];
  accounts: FinanceAccount[];
  currencyCode: string;
  onSaveSubscription: (sub: Partial<FinanceSubscription> & { id: string; name: string; amount: number; billingCycle: BillingCycle; nextBillingDate: string; category: FinanceCategory }) => Promise<void>;
  onDeleteSubscription: (id: string) => Promise<void>;
}

const CATEGORIES: FinanceCategory[] = [
  'Subscriptions',
  'Utilities',
  'Entertainment',
  'Education',
  'Health & Medical',
  'Shopping',
  'Other'
];

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  accounts,
  currencyCode,
  onSaveSubscription,
  onDeleteSubscription
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<FinanceSubscription | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<FinanceCategory>('Subscriptions');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [remindDaysBefore, setRemindDaysBefore] = useState('3');
  const [notes, setNotes] = useState('');

  // Calculate monthly & yearly burn rates
  const monthlyBurn = subscriptions.reduce((sum, s) => {
    if (s.status !== 'active') return sum;
    if (s.billingCycle === 'yearly') return sum + (s.amount / 12);
    if (s.billingCycle === 'quarterly') return sum + (s.amount / 3);
    return sum + s.amount;
  }, 0);

  const yearlyBurn = monthlyBurn * 12;

  const handleOpenAdd = () => {
    setSubToEdit(null);
    setName('');
    setAmount('');
    setCategory('Subscriptions');
    setBillingCycle('monthly');
    setNextBillingDate(new Date().toISOString().slice(0, 10));
    setAccountId(accounts[0]?.id || '');
    setRemindDaysBefore('3');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: FinanceSubscription) => {
    setSubToEdit(sub);
    setName(sub.name);
    setAmount(sub.amount.toString());
    setCategory(sub.category);
    setBillingCycle(sub.billingCycle);
    setNextBillingDate(sub.nextBillingDate);
    setAccountId(sub.accountId);
    setRemindDaysBefore(sub.remindDaysBefore.toString());
    setNotes(sub.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!name.trim() || isNaN(amt) || amt <= 0) return;

    await onSaveSubscription({
      id: subToEdit ? subToEdit.id : `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      amount: amt,
      category,
      billingCycle,
      nextBillingDate,
      accountId: accountId || accounts[0]?.id || 'acc-checking',
      status: subToEdit ? subToEdit.status : 'active',
      remindDaysBefore: parseInt(remindDaysBefore, 10) || 3,
      notes: notes.trim() || undefined,
      createdAt: subToEdit ? subToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setIsModalOpen(false);
  };

  const getAccountName = (accId: string) => {
    return accounts.find(a => a.id === accId)?.name || 'Default Card/Account';
  };

  return (
    <div className="space-y-4 text-white">
      {/* Top Banner: Burn Rate Summary */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#1c2230] via-[#161b22] to-[#0f131a] border border-[#30363d] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b949e]">
              Recurring Subscriptions & Fixed Burn Rate
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
              {formatCurrency(monthlyBurn, currencyCode)}{' '}
              <span className="text-xs font-normal text-indigo-300">/month</span>
            </h2>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscription</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#30363d]/70 text-xs">
          <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Annual Total</span>
            <p className="text-sm font-bold font-mono text-white mt-0.5">
              {formatCurrency(yearlyBurn, currencyCode)} /yr
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60">
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Active Subscriptions</span>
            <p className="text-sm font-bold font-mono text-indigo-300 mt-0.5">
              {subscriptions.filter(s => s.status === 'active').length} Active
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">Auto-Renewals</span>
            <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              Cloud Monitored
            </p>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-xs">
                      📺
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                      <p className="text-[10px] text-[#8b949e]">{sub.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors text-xs"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteSubscription(sub.id)}
                      className="p-1 rounded-lg bg-[#21262d] hover:bg-rose-500/20 text-[#8b949e] hover:text-rose-400 transition-colors text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="my-3 pt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-white">
                      {formatCurrency(sub.amount, currencyCode)}
                    </span>
                    <span className="text-xs text-[#8b949e] capitalize">
                      / {sub.billingCycle.replace('ly', '')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#30363d]/60 text-[10px] text-[#8b949e] flex items-center justify-between">
                <span>Renews: <strong className="text-indigo-300 font-mono">{sub.nextBillingDate}</strong></span>
                <span className="capitalize">{getAccountName(sub.accountId)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="sm:col-span-3 p-12 text-center text-[#8b949e] rounded-2xl bg-[#161b22] border border-[#30363d]">
            <Clock className="w-10 h-10 mx-auto text-[#8b949e]/40 mb-3" />
            <h4 className="text-sm font-bold text-white">No Recurring Subscriptions Added</h4>
            <p className="text-xs text-[#8b949e] mt-1">Track software licenses, streaming services, gym memberships, and utility bills.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              + Add First Subscription
            </button>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] text-white rounded-2xl w-full max-w-md p-4 space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-sm font-bold text-white">
              {subToEdit ? 'Edit Subscription' : 'Add Recurring Subscription'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Service / Bill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Netflix 4K, Spotify Duo, AWS Cloud, Rent"
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Amount ({currencyCode})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="19.99"
                    className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Billing Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                    className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Next Billing Date</label>
                  <input
                    type="date"
                    required
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">Payment Method / Account</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
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
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
