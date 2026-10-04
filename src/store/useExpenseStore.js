import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, getTodayStr } from '../utils/calculations';

export const EXPENSE_CATEGORIES = [
  { id: 'gym_fee', label: 'Gym Membership', icon: '🏋️‍♂️' },
  { id: 'supplements', label: 'Supplements (Whey/Creatine)', icon: '💊' },
  { id: 'groceries', label: 'Diet & Groceries (Chicken/Paneer)', icon: '🥩' },
  { id: 'smoothies', label: 'Shakes, Smoothies & Snacks', icon: '🥤' },
  { id: 'gear', label: 'Gym Gear & Apparel', icon: '👟' },
  { id: 'other', label: 'Other Gym Expense', icon: '🧾' },
];

const useExpenseStore = create(
  persist(
    (set, get) => ({
      currentEmail: null,
      expensesByUser: {}, // { [email]: [expenses] }
      expenses: [],
      partnerName: 'Gym Partner',

      setCurrentUser: (email) => {
        if (!email) {
          set({ currentEmail: null, expenses: [] });
          return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const existingExpenses = get().expensesByUser?.[cleanEmail] || [];
        set({
          currentEmail: cleanEmail,
          expenses: existingExpenses,
        });
      },

      setPartnerName: (name) => {
        set({ partnerName: name || 'Gym Partner' });
      },

      addExpense: (expenseData) => set((state) => {
        const email = state.currentEmail;
        const newExpense = {
          id: generateId(),
          title: expenseData.title.trim(),
          amount: Number(expenseData.amount) || 0,
          category: expenseData.category || 'other',
          paidBy: expenseData.paidBy || 'me', // 'me' | 'partner'
          splitType: expenseData.splitType || 'equal', // 'equal' (50/50) | 'all_partner' | 'all_me'
          date: expenseData.date || getTodayStr(),
          notes: expenseData.notes || '',
          isSettled: false,
          createdAt: new Date().toISOString(),
        };

        const updatedExpenses = [newExpense, ...(state.expenses || [])];
        const updatedByUser = email
          ? { ...state.expensesByUser, [email]: updatedExpenses }
          : state.expensesByUser;

        return {
          expenses: updatedExpenses,
          expensesByUser: updatedByUser,
        };
      }),

      deleteExpense: (id) => set((state) => {
        const email = state.currentEmail;
        const updatedExpenses = (state.expenses || []).filter((e) => e.id !== id);
        const updatedByUser = email
          ? { ...state.expensesByUser, [email]: updatedExpenses }
          : state.expensesByUser;

        return {
          expenses: updatedExpenses,
          expensesByUser: updatedByUser,
        };
      }),

      settleAll: () => set((state) => {
        const email = state.currentEmail;
        const updatedExpenses = (state.expenses || []).map((e) => ({
          ...e,
          isSettled: true,
        }));

        const updatedByUser = email
          ? { ...state.expensesByUser, [email]: updatedExpenses }
          : state.expensesByUser;

        return {
          expenses: updatedExpenses,
          expensesByUser: updatedByUser,
        };
      }),

      getSummary: () => {
        const expenses = get().expenses || [];
        let totalSpent = 0;
        let paidByMe = 0;
        let paidByPartner = 0;
        let myShare = 0;
        let partnerShare = 0;
        let unsettledCount = 0;

        expenses.forEach((item) => {
          const amt = Number(item.amount || 0);
          totalSpent += amt;

          if (!item.isSettled) {
            unsettledCount++;
            if (item.paidBy === 'me') {
              paidByMe += amt;
            } else {
              paidByPartner += amt;
            }

            if (item.splitType === 'equal') {
              myShare += amt / 2;
              partnerShare += amt / 2;
            } else if (item.splitType === 'all_partner') {
              partnerShare += amt;
            } else if (item.splitType === 'all_me') {
              myShare += amt;
            }
          }
        });

        // Balance: What I paid minus what was actually my share
        // If balance > 0 => Partner owes me
        // If balance < 0 => I owe partner
        const balance = Math.round(paidByMe - myShare);

        return {
          totalSpent: Math.round(totalSpent),
          paidByMe: Math.round(paidByMe),
          paidByPartner: Math.round(paidByPartner),
          myShare: Math.round(myShare),
          partnerShare: Math.round(partnerShare),
          balance,
          unsettledCount,
        };
      },
    }),
    { name: 'fitforge-expenses' }
  )
);

export default useExpenseStore;
