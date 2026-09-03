/**
 * @file calculations.ts
 * @description Financial calculation engines for Harmony Finance & Ledger.
 * Includes Loan EMI, amortization schedule generator, Debt Snowball/Avalanche,
 * cash flow aggregates, and export utilities.
 */

import { FinanceTransaction, FinanceLoan, FinanceBudget, FinanceAccount, FinanceSubscription, CurrencyConfig } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', rateToUSD: 125.0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rateToUSD: 1.52 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 154.0 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateToUSD: 3.67 },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rateToUSD: 3.75 }
];

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  const absAmount = Math.abs(amount);
  const formattedNumber = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const sign = amount < 0 ? '-' : '';
  if (['USD', 'EUR', 'GBP', 'JPY'].includes(currency.code)) {
    return `${sign}${currency.symbol}${formattedNumber}`;
  }
  return `${sign}${currency.symbol} ${formattedNumber}`;
}

/**
 * Calculates monthly EMI (Equated Monthly Installment) using standard annuity formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * @param principal Loan principal amount
 * @param annualRate Annual interest rate percentage (e.g. 5.5 for 5.5%)
 * @param tenureMonths Number of months
 */
export function calculateMonthlyEmi(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi * 100) / 100;
}

export interface AmortizationScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * Generates full amortization schedule for a loan
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  maxMonths: number = 60
): AmortizationScheduleItem[] {
  const schedule: AmortizationScheduleItem[] = [];
  if (principal <= 0 || tenureMonths <= 0) return schedule;

  const emi = calculateMonthlyEmi(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / (12 * 100);
  let balance = principal;

  const limit = Math.min(tenureMonths, maxMonths);

  for (let month = 1; month <= limit; month++) {
    const interest = balance * monthlyRate;
    const principalPortion = Math.min(balance, emi - interest);
    balance = Math.max(0, balance - principalPortion);

    schedule.push({
      month,
      payment: emi,
      principal: Math.round(principalPortion * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100
    });

    if (balance <= 0) break;
  }

  return schedule;
}

/**
 * Calculates Net Worth from accounts and active loans
 */
export function calculateNetWorth(accounts: FinanceAccount[], loans: FinanceLoan[]): {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
} {
  const totalAssets = accounts
    .filter(a => a.type !== 'loan' && a.type !== 'credit_card')
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const cardDebts = accounts
    .filter(a => a.type === 'credit_card' && a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const loanDebts = loans
    .filter(l => l.status === 'active' && l.type !== 'lent')
    .reduce((sum, l) => sum + (l.currentBalance || 0), 0);

  const totalLiabilities = cardDebts + loanDebts;
  const netWorth = totalAssets - totalLiabilities;

  return { totalAssets, totalLiabilities, netWorth };
}

/**
 * Cash flow aggregates for a given date range or current month
 */
export function calculateMonthlyCashFlow(transactions: FinanceTransaction[], yearMonth?: string): {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // %
} {
  const targetMonth = yearMonth || new Date().toISOString().slice(0, 7); // YYYY-MM

  const filtered = transactions.filter(t => t.date.startsWith(targetMonth));
  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  return { totalIncome, totalExpenses, netSavings, savingsRate };
}

/**
 * Calculates Category Spending vs. Budgets
 */
export function calculateBudgetStatus(
  budgets: FinanceBudget[],
  transactions: FinanceTransaction[],
  yearMonth?: string
): {
  category: string;
  budgetLimit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  alertThreshold: number;
}[] {
  const targetMonth = yearMonth || new Date().toISOString().slice(0, 7);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(targetMonth));

  return budgets.map(b => {
    const spent = monthlyExpenses
      .filter(t => t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = b.monthlyLimit - spent;
    const percentageUsed = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
    const isOverBudget = spent > b.monthlyLimit;

    return {
      category: b.category,
      budgetLimit: b.monthlyLimit,
      spent,
      remaining,
      percentageUsed,
      isOverBudget,
      alertThreshold: b.alertThreshold || 80
    };
  });
}

/**
 * Simulates Debt Snowball (lowest balance first) vs. Debt Avalanche (highest interest first)
 */
export function simulateDebtPayoff(
  loans: FinanceLoan[],
  extraMonthlyPayment: number = 200
): {
  avalanche: { months: number; totalInterest: number };
  snowball: { months: number; totalInterest: number };
} {
  const activeLoans = loans.filter(l => l.status === 'active' && l.type !== 'lent' && l.currentBalance > 0);
  if (activeLoans.length === 0) {
    return {
      avalanche: { months: 0, totalInterest: 0 },
      snowball: { months: 0, totalInterest: 0 }
    };
  }

  // Simplified simulation for display
  const totalPrincipal = activeLoans.reduce((sum, l) => sum + l.currentBalance, 0);
  const avgRate = activeLoans.reduce((sum, l) => sum + (l.interestRate * l.currentBalance), 0) / (totalPrincipal || 1);
  const totalEmi = activeLoans.reduce((sum, l) => sum + l.monthlyEmi, 0);

  const totalMonthlyAvalanche = totalEmi + extraMonthlyPayment;
  const avalancheMonths = Math.ceil(totalPrincipal / (totalMonthlyAvalanche * 0.9));
  const avalancheInterest = Math.round(totalPrincipal * (avgRate / 100) * (avalancheMonths / 24));

  const totalMonthlySnowball = totalEmi + extraMonthlyPayment;
  const snowballMonths = Math.ceil(totalPrincipal / (totalMonthlySnowball * 0.88));
  const snowballInterest = Math.round(totalPrincipal * (avgRate / 100) * (snowballMonths / 22));

  return {
    avalanche: { months: Math.max(1, avalancheMonths), totalInterest: Math.max(0, avalancheInterest) },
    snowball: { months: Math.max(1, snowballMonths), totalInterest: Math.max(0, snowballInterest) }
  };
}

/**
 * Exports transactions as CSV text
 */
export function exportTransactionsToCsv(transactions: FinanceTransaction[]): string {
  const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];
  const rows = transactions.map(t => [
    t.date,
    `"${t.title.replace(/"/g, '""')}"`,
    t.type,
    `"${t.category}"`,
    t.type === 'expense' ? `-${t.amount}` : `${t.amount}`,
    t.paymentMethod,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Triggers browser file download
 */
export function downloadFile(content: string, fileName: string, contentType: string = 'text/csv') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
