import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ReceiptText, Plus, Trash2, ArrowLeft, CheckCircle2, 
  Share2, Users, DollarSign, Wallet, Sparkles, X, 
  ChevronRight, Calendar, Tag, ArrowUpRight, ArrowDownLeft, 
  Clock, Check, Heart 
} from 'lucide-react';

import useAuthStore from '../store/useAuthStore';
import useDietStore from '../store/useDietStore';
import useExpenseStore, { EXPENSE_CATEGORIES } from '../store/useExpenseStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { getTodayStr, formatNumber } from '../utils/calculations';

const POPULAR_GYM_EXPENSES = [
  { title: 'Monthly Gym Membership', cat: 'gym_fee', amount: '1500' },
  { title: 'Whey Protein 1kg/2kg', cat: 'supplements', amount: '2400' },
  { title: 'Creatine Monohydrate', cat: 'supplements', amount: '800' },
  { title: 'Chicken & Eggs Groceries', cat: 'groceries', amount: '650' },
  { title: 'Post-Workout Smoothies', cat: 'smoothies', amount: '220' },
  { title: 'Pre-Workout & Energy Drink', cat: 'smoothies', amount: '180' },
  { title: 'Gym Gloves & Straps', cat: 'gear', amount: '450' },
];

export default function ExpenseTracker() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { partner } = useDietStore();
  const { 
    expenses, 
    addExpense, 
    deleteExpense, 
    settleAll, 
    getSummary, 
    partnerName, 
    setPartnerName 
  } = useExpenseStore();

  // If partner is configured in DietStore, sync partner name
  useEffect(() => {
    if (partner?.name && partner.name !== partnerName) {
      setPartnerName(partner.name);
    }
  }, [partner, partnerName, setPartnerName]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [newPartnerNameInput, setNewPartnerNameInput] = useState(partnerName);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [paidBy, setPaidBy] = useState('me'); // 'me' | 'partner'
  const [splitType, setSplitType] = useState('equal'); // 'equal' | 'all_partner' | 'all_me'
  const [date, setDate] = useState(getTodayStr());
  const [notes, setNotes] = useState('');

  const summary = useMemo(() => getSummary(), [expenses]);

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'all') return expenses;
    if (activeFilter === 'unsettled') return expenses.filter((e) => !e.isSettled);
    if (activeFilter === 'settled') return expenses.filter((e) => e.isSettled);
    return expenses.filter((e) => e.category === activeFilter);
  }, [expenses, activeFilter]);

  const handleOpenAddModal = (preset = null) => {
    if (preset) {
      setTitle(preset.title);
      setCategory(preset.cat);
      setAmount(preset.amount);
    } else {
      setTitle('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].id);
    }
    setPaidBy('me');
    setSplitType('equal');
    setDate(getTodayStr());
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e?.preventDefault();
    if (!title.trim()) {
      alert('Please enter an expense title.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addExpense({
      title,
      amount: Number(amount),
      category,
      paidBy,
      splitType,
      date,
      notes,
    });

    setIsAddModalOpen(false);
  };

  const handleSavePartnerName = () => {
    if (newPartnerNameInput.trim()) {
      setPartnerName(newPartnerNameInput.trim());
      setIsEditPartnerOpen(false);
    }
  };

  const handleShareWhatsAppSummary = () => {
    const friend = partnerName || 'Gym Partner';
    const myName = user?.name || 'Me';

    let balanceText = '';
    if (summary.balance > 0) {
      balanceText = `👉 Net Balance: ${friend} owes ${myName} ₹${formatNumber(summary.balance)}`;
    } else if (summary.balance < 0) {
      balanceText = `👉 Net Balance: ${myName} owes ${friend} ₹${formatNumber(Math.abs(summary.balance))}`;
    } else {
      balanceText = `👉 Net Balance: All settled up! (₹0)`;
    }

    const text = `🏋️ FitForge Gym Expenses Breakdown\nPartner: ${myName} & ${friend}\n\n• Total Spent Together: ₹${formatNumber(summary.totalSpent)}\n• ${myName} Paid: ₹${formatNumber(summary.paidByMe)}\n• ${friend} Paid: ₹${formatNumber(summary.paidByPartner)}\n\n${balanceText}\n\nShared via FitForge App 💪`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getCategoryInfo = (catId) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === catId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-dark-900 text-white pb-36 px-4 md:px-6 pt-6 max-w-2xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-dark-800 px-3 py-2 rounded-2xl border border-white/5 transition-colors"
        >
          <ArrowLeft size={16} /> Home
        </button>

        <button
          onClick={() => {
            setNewPartnerNameInput(partnerName);
            setIsEditPartnerOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 border border-accent/40 rounded-full text-accent text-xs font-bold hover:bg-accent/25 transition-all shadow-sm"
          title="Change gym friend name"
        >
          <span>👫 {partnerName}</span>
          <span className="text-[10px] text-accent/80 font-normal">Edit</span>
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold gradient-accent-text flex items-center gap-2">
          <ReceiptText size={28} className="text-accent" /> Gym Expense Splitter
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Keep track of shared gym fees, supplements, groceries, and smoothies effortlessly.
        </p>
      </div>

      {/* ============================================================== */}
      {/* HERO BALANCE CARD */}
      {/* ============================================================== */}
      <div className={`p-6 rounded-3xl relative overflow-hidden border transition-all ${
        summary.balance > 0 
          ? 'bg-gradient-to-br from-emerald-950/70 via-dark-800 to-dark-900 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
          : summary.balance < 0
          ? 'bg-gradient-to-br from-orange-950/70 via-dark-800 to-dark-900 border-orange-500/40 shadow-lg shadow-orange-500/10'
          : 'bg-dark-800/90 border-white/10'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-1">
              Current Net Balance
            </span>
            {summary.balance > 0 ? (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {partnerName} owes you ₹{formatNumber(summary.balance)}
                </h2>
                <p className="text-xs text-emerald-300/80 mt-1">
                  You paid ₹{formatNumber(summary.paidByMe)} • Her share is ₹{formatNumber(summary.partnerShare)}
                </p>
              </div>
            ) : summary.balance < 0 ? (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-orange-400">
                  You owe {partnerName} ₹{formatNumber(Math.abs(summary.balance))}
                </h2>
                <p className="text-xs text-orange-300/80 mt-1">
                  She paid ₹{formatNumber(summary.paidByPartner)} • Your share is ₹{formatNumber(summary.myShare)}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-accent flex items-center gap-2">
                  All Settled Up! ✨
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  No pending debts between you and {partnerName}.
                </p>
              </div>
            )}
          </div>

          <div className="text-3xl">
            {summary.balance > 0 ? '💰' : summary.balance < 0 ? '🤝' : '✨'}
          </div>
        </div>

        {/* Settle Action */}
        {summary.balance !== 0 && (
          <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-[11px] text-gray-400">
              {summary.unsettledCount} unsettled transaction{summary.unsettledCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => {
                if (window.confirm(`Mark all expenses between you and ${partnerName} as settled?`)) {
                  settleAll();
                }
              }}
              className="px-3.5 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-xl text-xs font-bold text-white transition-colors border border-white/10"
            >
              Mark as Settled Up
            </button>
          </div>
        )}
      </div>

      {/* Summary 3-Col Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="glass p-3.5 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Spent</span>
          <span className="font-bold text-white text-base mt-0.5 block">
            ₹{formatNumber(summary.totalSpent)}
          </span>
        </div>
        <div className="glass p-3.5 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">You Paid</span>
          <span className="font-bold text-accent text-base mt-0.5 block">
            ₹{formatNumber(summary.paidByMe)}
          </span>
        </div>
        <div className="glass p-3.5 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">{partnerName} Paid</span>
          <span className="font-bold text-accent2 text-base mt-0.5 block">
            ₹{formatNumber(summary.paidByPartner)}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={18} />}
          onClick={() => handleOpenAddModal()}
        >
          Add Expense
        </Button>

        <button
          onClick={handleShareWhatsAppSummary}
          className="py-3 px-4 bg-emerald-700/80 hover:bg-emerald-600 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span>💬</span> Send Summary
        </button>
      </div>

      {/* Quick Suggestions Row */}
      <div className="space-y-1.5">
        <div className="text-xs text-gray-400 font-semibold px-1">Tap for Quick Log:</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_GYM_EXPENSES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleOpenAddModal(preset)}
              className="bg-dark-800 hover:bg-dark-700 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-gray-300 font-medium whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <span>{getCategoryInfo(preset.cat).icon}</span>
              <span>{preset.title}</span>
              <span className="text-accent font-bold">₹{preset.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPENSE LIST & FILTERS */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-base flex items-center gap-2">
            <span>Recent Expenses</span>
            <span className="text-xs bg-dark-700 text-gray-400 px-2 py-0.5 rounded-full font-normal">
              {filteredExpenses.length}
            </span>
          </h3>

          {/* Filter Pills */}
          <div className="flex gap-1 overflow-x-auto text-[11px]">
            {['all', 'unsettled', 'settled'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  activeFilter === f 
                    ? 'bg-accent text-dark-900 font-bold' 
                    : 'text-gray-400 hover:text-white bg-dark-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="glass-strong rounded-3xl p-8 text-center space-y-3 border border-dashed border-dark-700">
            <ReceiptText size={40} className="mx-auto text-accent opacity-40" />
            <div>
              <p className="font-semibold text-white">No expenses recorded yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Log gym membership, protein, smoothies, or grocery runs with {partnerName}!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => handleOpenAddModal()}
            >
              Add First Expense
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExpenses.map((item) => {
              const catInfo = getCategoryInfo(item.category);
              const isPaidByMe = item.paidBy === 'me';

              return (
                <div
                  key={item.id}
                  className={`bg-dark-800/90 rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 ${
                    item.isSettled ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl flex-shrink-0">
                      {catInfo.icon}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                        {item.isSettled && (
                          <span className="text-[9px] bg-dark-700 text-gray-400 px-1.5 py-0.2 rounded font-medium">
                            Settled
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 flex-wrap">
                        <span className={`font-semibold ${isPaidByMe ? 'text-accent' : 'text-accent2'}`}>
                          {isPaidByMe ? 'You paid' : `${partnerName} paid`}
                        </span>
                        <span>•</span>
                        <span>
                          {item.splitType === 'equal' ? 'Split 50/50' : item.splitType === 'all_partner' ? `100% for ${partnerName}` : '100% for You'}
                        </span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-base text-white">
                        ₹{formatNumber(item.amount)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {item.splitType === 'equal'
                          ? `₹${formatNumber(item.amount / 2)} each`
                          : item.splitType === 'all_partner'
                          ? isPaidByMe ? `+₹${item.amount} owed` : ''
                          : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteExpense(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 bg-dark-700/60 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD EXPENSE MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Log Gym Expense">
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Expense Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Gym Fee, Whey Protein, Smoothies"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl py-3 px-4 font-semibold text-white outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Amount (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-3 px-4 font-bold text-accent text-lg outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-3 px-3 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl py-3 px-3.5 text-xs font-semibold text-white outline-none"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Who Paid? */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Who Paid?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaidBy('me')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      paidBy === 'me'
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-dark-700 border-white/5 text-gray-400'
                    }`}
                  >
                    <span>👤 I Paid (Me)</span>
                    {paidBy === 'me' && <Check size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaidBy('partner')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      paidBy === 'partner'
                        ? 'bg-accent2/20 border-accent2 text-accent2'
                        : 'bg-dark-700 border-white/5 text-gray-400'
                    }`}
                  >
                    <span>👭 {partnerName} Paid</span>
                    {paidBy === 'partner' && <Check size={14} />}
                  </button>
                </div>
              </div>

              {/* How to Split? */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  How to Split?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitType('equal')}
                    className={`p-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      splitType === 'equal'
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-dark-700 border-white/5 text-gray-400'
                    }`}
                  >
                    🤝 Split 50/50
                  </button>

                  <button
                    type="button"
                    onClick={() => setSplitType('all_partner')}
                    className={`p-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      splitType === 'all_partner'
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-dark-700 border-white/5 text-gray-400'
                    }`}
                  >
                    🙋 100% {partnerName}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSplitType('all_me')}
                    className={`p-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      splitType === 'all_me'
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-dark-700 border-white/5 text-gray-400'
                    }`}
                  >
                    💁 100% Myself
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="primary" fullWidth size="lg" type="submit">
                  Save Gym Expense
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* EDIT PARTNER NAME MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isEditPartnerOpen && (
          <Modal isOpen={isEditPartnerOpen} onClose={() => setIsEditPartnerOpen(false)} title="Gym Partner Name">
            <div className="space-y-4">
              <p className="text-gray-400 text-xs">
                Set your gym partner's name so splits and expense records show up clearly.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Friend's Name
                </label>
                <input
                  type="text"
                  value={newPartnerNameInput}
                  onChange={(e) => setNewPartnerNameInput(e.target.value)}
                  placeholder="e.g. Sarah, Priya, Ananya"
                  className="w-full bg-dark-700 rounded-xl py-3 px-4 font-semibold text-white outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" fullWidth onClick={() => setIsEditPartnerOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handleSavePartnerName}>
                  Save Name
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
