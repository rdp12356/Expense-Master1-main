import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, DEFAULT_CATEGORIES } from '../types';

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

// Simple ID generator for local storage
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      
      addTransaction: (tx) => set((state) => ({
        transactions: [
          {
            ...tx,
            id: generateId(),
            createdAt: new Date().toISOString(),
          },
          ...state.transactions,
        ],
      })),
      
      updateTransaction: (id, updatedFields) => set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...updatedFields } : tx
        ),
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      })),

      addCategory: (cat) => set((state) => ({
        categories: [
          ...state.categories,
          { ...cat, id: generateId() }
        ],
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      })),
    }),
    {
      name: 'expense-transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
