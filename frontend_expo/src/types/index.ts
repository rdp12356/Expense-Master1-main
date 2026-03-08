export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  title: string;
  notes?: string;
  date: string; // ISO string
  type: TransactionType;
  categoryId: string;
  currency: string;
  receiptUrl?: string; // Local file URI
  createdAt: string;
  
  // Advanced Global First Features
  emotion?: 'Joy' | 'Stress' | 'Impulse' | 'Sadness' | 'Neutral';
  isBarter?: boolean;
  barterDescription?: string;
}

export interface UserSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  ghostRacingEnabled: boolean;
  financialAuraEnabled: boolean;
  appLockEnabled: boolean;
  incognitoMode: boolean;
  onlineSyncEnabled: boolean;
}

// Predefined default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food', type: 'expense', icon: 'coffee', color: '#ef4444' }, // red
  { id: 'cat-2', name: 'Travel', type: 'expense', icon: 'plane', color: '#f59e0b' }, // amber
  { id: 'cat-3', name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#8b5cf6' }, // violet
  { id: 'cat-4', name: 'Bills', type: 'expense', icon: 'file-text', color: '#06b6d4' }, // cyan
  { id: 'cat-5', name: 'Education', type: 'expense', icon: 'book', color: '#3b82f6' }, // blue
  { id: 'cat-6', name: 'Healthcare', type: 'expense', icon: 'heart', color: '#ec4899' }, // pink
  { id: 'cat-7', name: 'Entertainment', type: 'expense', icon: 'film', color: '#10b981' }, // emerald
  { id: 'cat-8', name: 'Other', type: 'expense', icon: 'grid', color: '#6b7280' }, // gray
  { id: 'cat-9', name: 'Salary', type: 'income', icon: 'briefcase', color: '#10b981' },
  { id: 'cat-10', name: 'Freelance', type: 'income', icon: 'monitor', color: '#3b82f6' },
  { id: 'cat-11', name: 'Investment', type: 'income', icon: 'trending-up', color: '#8b5cf6' },
  { id: 'cat-12', name: 'Other Income', type: 'income', icon: 'plus-circle', color: '#6b7280' },
];
