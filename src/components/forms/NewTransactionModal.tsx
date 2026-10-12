// Modal Form to Record Income & Expense Financial Transactions

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { TransactionType, IncomeCategory, ExpenseCategory } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, currentUser } = useApp();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<number>(5000);
  const [category, setCategory] = useState<string>('Fertilizers');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [relatedCropOrSeason, setRelatedCropOrSeason] = useState('Samba 2026');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Kisan Credit Card (KCC)'>('UPI');
  const [notes, setNotes] = useState('');

  const incomeCategories: IncomeCategory[] = [
    'Crop Sales',
    'Subsidies & Govt Grants',
    'Equipment Rental Income',
    'Livestock & Dairy',
    'Other Farm Income',
  ];

  const expenseCategories: ExpenseCategory[] = [
    'Seeds',
    'Fertilizers',
    'Pesticides & Bio-control',
    'Labour & Wages',
    'Irrigation & Electricity',
    'Fuel & Transport',
    'Equipment Purchase & Rental',
    'Loan Repayments',
    'Maintenance & Repairs',
    'Storage & Packaging',
    'Other Farm Expenses',
  ];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !description.trim()) return;

    addTransaction({
      type,
      amount: Number(amount),
      category: category as any,
      date,
      description,
      relatedCropOrSeason,
      paymentMethod,
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Farm Financial Transaction"
      subtitle="Instantly updates your seasonal net profit, ledger, and category budget alarms."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Type Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📉 Expense Outflow
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-farm-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📈 Income Inflow
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
          <input
            type="number"
            required
            min="1"
            placeholder="e.g. 12500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Financial Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
          >
            {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description / Bill Memo</label>
          <input
            type="text"
            required
            placeholder="e.g. 5 bags of complex fertilizer from PACCS"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="UPI">UPI (GPay/PhonePe)</option>
              <option value="Cash">Cash at Mandi</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
              <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Crop or Agricultural Season</label>
          <input
            type="text"
            placeholder="e.g. Samba 2026 - CO-51 Paddy"
            value={relatedCropOrSeason}
            onChange={(e) => setRelatedCropOrSeason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};
