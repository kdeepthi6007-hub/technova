// Financial Management & Farm Expense Calculations

import { FinancialTransaction, CategoryBudget, ExpenseCategory } from '../types';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMarginPercent: number;
  transactionCount: number;
}

export interface MonthlyFinancialSummary {
  monthKey: string; // YYYY-MM
  monthLabel: string; // e.g. Oct 2026
  income: number;
  expenses: number;
  netProfit: number;
}

export interface CategoryExpenseBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number; // 0 to 100
}

export interface BudgetStatus {
  category: ExpenseCategory;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageConsumed: number;
  isWarning: boolean;
  isExceeded: boolean;
}

/**
 * Calculates overall financial summary
 */
export function calculateFinancialSummary(transactions: FinancialTransaction[]): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else if (t.type === 'expense') {
      totalExpenses += amt;
    }
  }

  totalIncome = Number(totalIncome.toFixed(2));
  totalExpenses = Number(totalExpenses.toFixed(2));
  const netProfit = Number((totalIncome - totalExpenses).toFixed(2));
  const profitMarginPercent = totalIncome > 0 
    ? Number(((netProfit / totalIncome) * 100).toFixed(1)) 
    : 0;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMarginPercent,
    transactionCount: transactions.length,
  };
}

/**
 * Groups transactions by month for trend charts
 */
export function calculateMonthlyTrends(transactions: FinancialTransaction[]): MonthlyFinancialSummary[] {
  const monthMap: Record<string, { income: number; expenses: number; label: string }> = {};

  for (const t of transactions) {
    if (!t.date) continue;
    const dateObj = new Date(t.date);
    if (isNaN(dateObj.getTime())) continue;

    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = dateObj.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expenses: 0, label: monthLabel };
    }

    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      monthMap[monthKey].income += amt;
    } else {
      monthMap[monthKey].expenses += amt;
    }
  }

  return Object.keys(monthMap)
    .sort()
    .map(key => {
      const data = monthMap[key];
      const income = Number(data.income.toFixed(2));
      const expenses = Number(data.expenses.toFixed(2));
      return {
        monthKey: key,
        monthLabel: data.label,
        income,
        expenses,
        netProfit: Number((income - expenses).toFixed(2)),
      };
    });
}

/**
 * Calculates breakdown of expenses by category
 */
export function calculateCategoryExpenses(transactions: FinancialTransaction[]): CategoryExpenseBreakdown[] {
  const expenseMap: Record<string, number> = {};
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'expense') {
      const amt = Number(t.amount) || 0;
      expenseMap[t.category] = (expenseMap[t.category] || 0) + amt;
      totalExpenses += amt;
    }
  }

  return Object.entries(expenseMap)
    .map(([cat, amt]) => {
      const amount = Number(amt.toFixed(2));
      const percentage = totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0;
      return {
        category: cat as ExpenseCategory,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Calculates budget consumption and warning flags
 */
export function calculateBudgetStatuses(
  transactions: FinancialTransaction[],
  budgets: CategoryBudget[]
): BudgetStatus[] {
  // Aggregate expenses for current transactions
  const expenseMap: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type === 'expense') {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + (Number(t.amount) || 0);
    }
  }

  return budgets.map(budget => {
    const spentAmount = Number((expenseMap[budget.category] || 0).toFixed(2));
    const budgetAmount = Number(budget.budgetAmount) || 0;
    const remainingAmount = Number((budgetAmount - spentAmount).toFixed(2));
    const percentageConsumed = budgetAmount > 0 
      ? Number(((spentAmount / budgetAmount) * 100).toFixed(1)) 
      : 0;

    const threshold = budget.warningThresholdPercent || 80;
    const isExceeded = spentAmount > budgetAmount;
    const isWarning = !isExceeded && percentageConsumed >= threshold;

    return {
      category: budget.category,
      budgetAmount,
      spentAmount,
      remainingAmount,
      percentageConsumed,
      isWarning,
      isExceeded,
    };
  });
}

/**
 * Generates grounded, data-backed financial insights from actual numbers
 */
export function generateExpenseInsights(
  transactions: FinancialTransaction[],
  budgets: CategoryBudget[]
): {
  topExpenseCategory?: { category: string; amount: number; percentage: number };
  budgetAlerts: { category: string; spent: number; budget: number; percent: number }[];
  netProfitStatus: { profit: number; margin: number; isProfitable: boolean };
  savingsRecommendation: string;
} {
  const summary = calculateFinancialSummary(transactions);
  const categories = calculateCategoryExpenses(transactions);
  const budgetStatuses = calculateBudgetStatuses(transactions, budgets);

  const topExpenseCategory = categories.length > 0 ? categories[0] : undefined;
  const budgetAlerts = budgetStatuses
    .filter(b => b.isExceeded || b.isWarning)
    .map(b => ({
      category: b.category,
      spent: b.spentAmount,
      budget: b.budgetAmount,
      percent: b.percentageConsumed,
    }));

  let savingsRecommendation = 'Monitor ongoing input costs closely as harvest approaches.';
  if (topExpenseCategory) {
    if (topExpenseCategory.category.includes('Fertilizer')) {
      savingsRecommendation = `Fertilizers account for ${topExpenseCategory.percentage}% of your expenses. Consider booking nano-urea through primary cooperative societies (PACCS) to lower input expenses.`;
    } else if (topExpenseCategory.category.includes('Equipment')) {
      savingsRecommendation = `Equipment rentals account for ${topExpenseCategory.percentage}% of your spending. Pooling rentals with neighboring farms could reduce per-acre machinery costs.`;
    } else if (topExpenseCategory.category.includes('Labour')) {
      savingsRecommendation = `Labour is your largest cost center at ${topExpenseCategory.percentage}%. Renting custom-hired mechanical transplanters or weeders can reduce wage pressure.`;
    }
  }

  return {
    topExpenseCategory,
    budgetAlerts,
    netProfitStatus: {
      profit: summary.netProfit,
      margin: summary.profitMarginPercent,
      isProfitable: summary.netProfit >= 0,
    },
    savingsRecommendation,
  };
}
