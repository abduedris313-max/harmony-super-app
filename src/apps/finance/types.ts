/**
 * @file types.ts
 * @description Type definitions for Harmony Finance & Ledger Mini App.
 */

export type TransactionType = 'expense' | 'income' | 'transfer';

export type FinanceCategory = 
  | 'Housing'
  | 'Food & Dining'
  | 'Groceries'
  | 'Transportation'
  | 'Utilities'
  | 'Health & Medical'
  | 'Entertainment'
  | 'Shopping'
  | 'Education'
  | 'Salary'
  | 'Freelance & Business'
  | 'Investment & Dividends'
  | 'Loan Payment'
  | 'Debt Repayment'
  | 'Gifts & Donations'
  | 'Travel'
  | 'Subscriptions'
  | 'Other';

export type PaymentMethod = 'cash' | 'bank_account' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_money' | 'crypto';

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit_card' | 'investment' | 'loan';

export type LoanType = 'mortgage' | 'auto' | 'student' | 'personal' | 'borrowed' | 'lent';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface FinanceTransaction {
  id: string;
  userId?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: FinanceCategory;
  date: string; // YYYY-MM-DD
  accountId: string; // Source account
  toAccountId?: string; // For transfers
  paymentMethod: PaymentMethod;
  notes?: string;
  tags?: string[];
  isRecurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceBudget {
  id: string;
  userId?: string;
  category: FinanceCategory;
  monthlyLimit: number;
  alertThreshold: number; // e.g. 80 (%)
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceAccount {
  id: string;
  userId?: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution?: string;
  accountNumberMasked?: string;
  color: string;
  updatedAt?: string;
}

export interface LoanPaymentRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  principalPortion: number;
  interestPortion: number;
  notes?: string;
}

export interface FinanceLoan {
  id: string;
  userId?: string;
  title: string;
  type: LoanType;
  lenderOrBorrower: string;
  originalPrincipal: number;
  currentBalance: number;
  interestRate: number; // Annual % (APR)
  tenureMonths: number;
  monthlyEmi: number;
  startDate: string; // YYYY-MM-DD
  nextDueDate: string; // YYYY-MM-DD
  totalPaidSoFar: number;
  status: 'active' | 'paid_off' | 'defaulted';
  notes?: string;
  paymentHistory?: LoanPaymentRecord[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceSubscription {
  id: string;
  userId?: string;
  name: string;
  amount: number;
  category: FinanceCategory;
  billingCycle: BillingCycle;
  nextBillingDate: string; // YYYY-MM-DD
  accountId: string;
  status: 'active' | 'paused' | 'cancelled';
  remindDaysBefore: number;
  notes?: string;
  serviceIcon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FinanceTab = 
  | 'overview' 
  | 'expenses' 
  | 'budget' 
  | 'ledger' 
  | 'loans' 
  | 'subscriptions' 
  | 'ai-advisor';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number;
}
