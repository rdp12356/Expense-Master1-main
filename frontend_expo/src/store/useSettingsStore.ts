import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';
import { api } from '../services/api';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
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
      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));

        // Push settings to cloud
        if (get().settings.onlineSyncEnabled) {
          try {
            await api.updateSettings(newSettings);
          } catch (error) {
            console.warn('Failed to sync settings:', error);
          }
        }
      },
    }),
    {
      name: 'expense-settings-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


// We will load the actual 195+ data lists into a utility file, 
// but the store is now ready to hold any of those codes.
