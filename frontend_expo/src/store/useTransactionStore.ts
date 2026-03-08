import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, DEFAULT_CATEGORIES } from '../types';
import { api } from '../services/api';

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  isSyncing: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  syncWithCloud: () => Promise<void>;
}

// Simple ID generator for local storage
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      isSyncing: false,
      
      addTransaction: async (tx) => {
        const newTx = {
          ...tx,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        // Update local state first (Local-First)
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));

        // Push to cloud in background
        try {
          await api.saveTransaction(newTx);
        } catch (error) {
          console.warn('Cloud sync failed, will retry later:', error);
        }
      },
      
      updateTransaction: async (id, updatedFields) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updatedFields } : tx
          ),
        }));
        
        // In a full implementation, we'd have a PATCH endpoint for specific tx
      },
      
      deleteTransaction: async (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },

      addCategory: (cat) => set((state) => ({
        categories: [
          ...state.categories,
          { ...cat, id: generateId() }
        ],
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      })),

      syncWithCloud: async () => {
        set({ isSyncing: true });
        try {
          const response = await api.sync();
          if (response.data.transactions) {
            // Simple merge: remote transactions take precedence if they differ
            // In a production app, we'd use CRDTs or timestamps for conflict resolution
            set({ transactions: response.data.transactions });
          }
        } catch (error) {
          console.error('Initial sync failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      }
    }),
    {
      name: 'expense-transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

