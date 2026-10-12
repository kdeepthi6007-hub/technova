// Module Two: Smart Farm Expense Tracker, Ledger, Budgets & Visual Reports

import React, { useState } from 'react';
import { 
  ReceiptIndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  PieChart as PieIcon, 
  BarChart3, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FinancialTransaction, 
  TransactionType, 
  FarmFinancialCategory, 
  ExpenseCategory, 
  IncomeCategory 
} from '../types';
import { formatINR, formatDate, formatPercent } from '../utils/formatters';
import { 
  calculateFinancialSummary, 
  calculateMonthlyTrends, 
  calculateCategoryExpenses, 
  calculateBudgetStatuses, 
  generateExpenseInsights 
} from '../utils/financialCalculations';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface ExpenseTrackerPageProps {
  onOpenNewTransaction: () => void;
}

export const ExpenseTrackerPage: React.FC<ExpenseTrackerPageProps> = ({
  onOpenNewTransaction,
}) => {
  const { transactions, budgets, deleteTransaction, editTransaction } = useApp();
  const { t } = useLanguage();

  // Filters & State
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'last_30' | 'last_90' | 'this_year'>('all');
  const [activeTab, setActiveTab] = useState<'ledger' | 'budgets' | 'charts'>('ledger');

  // Edit and Delete Modals
  const [editingTx, setEditingTx] = useState<FinancialTransaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // Compute live financial analytics
  const summary = calculateFinancialSummary(transactions);
  const monthlyTrends = calculateMonthlyTrends(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);
  const budgetStatuses = calculateBudgetStatuses(transactions, budgets);
  const aiInsights = generateExpenseInsights(transactions, budgets);

  const PIE_COLORS = ['#15803D', '#D97706', '#2563EB', '#9333EA', '#DC2626', '#0D9488', '#E11D48'];

  // Filter Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;

    let matchesDate = true;
    if (dateFilter !== 'all' && tx.date) {
      const txDate = new Date(tx.date).getTime();
      const now = new Date().getTime();
      if (dateFilter === 'last_30') matchesDate = now - txDate <= 30 * 24 * 60 * 60 * 1000;
      if (dateFilter === 'last_90') matchesDate = now - txDate <= 90 * 24 * 60 * 60 * 1000;
      if (dateFilter === 'this_year') matchesDate = new Date(tx.date).getFullYear() === 2026;
    }

    return matchesType && matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount (INR)', 'Payment Method', 'Season', 'Notes'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.date,
      tx.type.toUpperCase(),
      `"${tx.category}"`,
      `"${tx.description}"`,
      tx.amount,
      tx.paymentMethod,
      `"${tx.relatedCropOrSeason || ''}"`,
      `"${tx.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Farm2Pay_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    editTransaction(editingTx);
    setEditingTx(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Module 2: Smart Accounting
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Farm Financial Ledger & Budgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track farm sales, seeds, fertilizers, labour wages, and seasonal profit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            title="Download CSV for Kisan Credit Card audit"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farm Income"
          value={formatINR(summary.totalIncome)}
          subtitle="From crop sales & govt subsidies"
          icon={TrendingUp}
          variant="green"
        />

        <StatCard
          title="Total Farm Expenses"
          value={formatINR(summary.totalExpenses)}
          subtitle="Inputs, labour & machinery"
          icon={TrendingDown}
          variant="amber"
        />

        <StatCard
          title="Net Operating Profit"
          value={formatINR(summary.netProfit)}
          subtitle={`Profit Margin: ${formatPercent(summary.profitMarginPercent)}`}
          icon={summary.netProfit >= 0 ? CheckCircle2 : AlertTriangle}
          variant={summary.netProfit >= 0 ? 'green' : 'red'}
          trend={{
            value: `${summary.profitMarginPercent}%`,
            isPositive: summary.netProfit >= 0,
          }}
        />

        <StatCard
          title="Budget Health"
          value={`${budgetStatuses.filter(b => !b.isExceeded).length}/${budgetStatuses.length} OK`}
          subtitle={aiInsights.budgetAlerts.length > 0 ? `${aiInsights.budgetAlerts.length} categories on alert` : 'All within seasonal limits'}
          icon={AlertTriangle}
          variant={aiInsights.budgetAlerts.length > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* AI Expense Insight Pill */}
      {aiInsights.topExpenseCategory && (
        <div className="p-4 bg-farm-50 rounded-2xl border border-farm-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-farm-700 shrink-0 mt-0.5" />
          <div className="text-xs text-farm-900 leading-relaxed">
            <strong>AI Financial Insight: </strong>
            {aiInsights.topExpenseCategory.category} is your highest cost driver at{' '}
            <strong>{formatINR(aiInsights.topExpenseCategory.amount)} ({aiInsights.topExpenseCategory.percentage}%)</strong>.{' '}
            {aiInsights.savingsRecommendation}
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Transactions Ledger ({filteredTransactions.length})
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'budgets'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Category Budgets ({budgets.length})
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'charts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Visual Analytics & Trends
        </button>
      </div>

      {/* TAB 1: Transactions Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterType === 'all' ? 'bg-farm-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterType === 'income' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Income Only
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterType === 'expense' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Expenses Only
              </button>
            </div>

            <div className="relative flex-1 max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-farm-500/20"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-600">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{tx.description}</div>
                          {tx.relatedCropOrSeason && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Season: {tx.relatedCropOrSeason}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                          {tx.paymentMethod}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-extrabold text-sm">
                          <span className={tx.type === 'income' ? 'text-emerald-700' : 'text-amber-800'}>
                            {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingTx(tx)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTxId(tx.id)}
                              className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Category Budgets */}
      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetStatuses.map((b) => (
            <div
              key={b.category}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{b.category}</h4>
                  {b.isExceeded ? (
                    <Badge label="Exceeded Limit" variant="red" size="sm" />
                  ) : b.isWarning ? (
                    <Badge label="Warning Threshold" variant="amber" size="sm" />
                  ) : (
                    <Badge label="Healthy" variant="green" size="sm" />
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-3 text-xs">
                  <span className="text-slate-500">Spent: <strong>{formatINR(b.spentAmount)}</strong></span>
                  <span className="text-slate-500">Allocation: <strong>{formatINR(b.budgetAmount)}</strong></span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mt-2 border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.isExceeded ? 'bg-red-600' : b.isWarning ? 'bg-amber-500' : 'bg-farm-600'
                    }`}
                    style={{ width: `${Math.min(100, b.percentageConsumed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-slate-500">{b.percentageConsumed}% consumed</span>
                  <span className={b.remainingAmount < 0 ? 'text-red-700 font-bold' : 'text-slate-600'}>
                    {b.remainingAmount >= 0 ? `${formatINR(b.remainingAmount)} remaining` : `Exceeded by ${formatINR(Math.abs(b.remainingAmount))}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Visual Analytics & Charts */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Monthly Inflows vs Outflows</h3>
            <p className="text-xs text-slate-500 mb-4">Cash flow trends across the past months</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <RechartsTooltip formatter={(val: any) => formatINR(Number(val) || 0)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="income" name="Income" fill="#15803D" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#D97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Expense Breakdown by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Proportion of seasonal farm expenditure</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => formatINR(Number(val) || 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <Modal
          isOpen={!!editingTx}
          onClose={() => setEditingTx(null)}
          title="Edit Financial Transaction"
          subtitle="Modifying this transaction will automatically update all dashboards, charts, and budget limits."
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={editingTx.amount}
                onChange={(e) => setEditingTx({ ...editingTx, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={editingTx.description}
                onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={editingTx.date}
                  onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={editingTx.paymentMethod}
                  onChange={(e) => setEditingTx({ ...editingTx, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Kisan Credit Card (KCC)">KCC Card</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTxId}
        title="Delete Transaction Record?"
        message="Are you sure you want to delete this transaction? All connected charts, net profit metrics, and budget summaries will be recalculated immediately."
        confirmLabel="Yes, Delete Record"
        isDestructive={true}
        onConfirm={() => {
          if (deletingTxId) {
            deleteTransaction(deletingTxId);
            setDeletingTxId(null);
          }
        }}
        onCancel={() => setDeletingTxId(null)}
      />

    </div>
  );
};
