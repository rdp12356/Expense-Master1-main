import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        currency: 'USD',
        language: 'en',
        theme: 'system',
        ghostRacingEnabled: true,
        financialAuraEnabled: true,
        appLockEnabled: false,
        incognitoMode: false,
        onlineSyncEnabled: false,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'expense-settings-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// We will load the actual 195+ data lists into a utility file, 
// but the store is now ready to hold any of those codes.
