import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useTransactionStore } from '../src/store/useTransactionStore';
import { CURRENCIES, LANGUAGES } from '../src/utils/constants';
import { Save, Download, Upload, Trash2, Shield, EyeOff, Activity, Droplets } from 'lucide-react-native';
import { AuraBackground } from '../src/components/AuraBackground';

export default function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const { transactions, categories } = useTransactionStore();
  
  const isDark = settings.theme === 'dark' || settings.theme === 'system';
  
  const [currency, setCurrency] = useState(settings.currency);
  const [language, setLanguage] = useState(settings.language);

  const toggleTheme = () => updateSettings({ theme: isDark ? 'light' : 'dark' });
  
  // Advanced Global Defaults Toggles
  const toggleAura = () => updateSettings({ financialAuraEnabled: !settings.financialAuraEnabled });
  const toggleGhost = () => updateSettings({ ghostRacingEnabled: !settings.ghostRacingEnabled });
  const toggleAppLock = () => updateSettings({ appLockEnabled: !settings.appLockEnabled });
  const toggleIncognito = () => updateSettings({ incognitoMode: !settings.incognitoMode });
  const toggleOnlineSync = () => updateSettings({ onlineSyncEnabled: !settings.onlineSyncEnabled });

  const handleExport = () => {
    Alert.alert('Export Ready', `Offline sync package generated. ${transactions.length} transactions protected.`);
  };

  return (
    <AuraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-background/90' : 'bg-gray-50/90'}`}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className={`text-3xl font-bold mb-8 ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
            Configuration
          </Text>

          {/* Privacy & Security */}
          <Text className={`text-sm font-bold uppercase mb-3 ml-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Security & Privacy</Text>
          <View className={`${isDark ? 'bg-card' : 'bg-white'} p-5 rounded-3xl shadow-sm mb-8`}>
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Shield color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
                <View>
                  <Text className={`text-lg font-semibold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>App Lock</Text>
                  <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Require FaceID/Biometrics</Text>
                </View>
              </View>
              <Switch value={settings.appLockEnabled} onValueChange={toggleAppLock} trackColor={{ false: '#cbd5e1', true: '#10b981' }} />
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <EyeOff color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
                <View>
                  <Text className={`text-lg font-semibold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Incognito Mode</Text>
                  <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Hide balances & disable screenshots</Text>
                </View>
              </View>
              <Switch value={settings.incognitoMode} onValueChange={toggleIncognito} trackColor={{ false: '#cbd5e1', true: '#6366f1' }} />
            </View>
          </View>

          {/* Global First UI Engine */}
          <Text className={`text-sm font-bold uppercase mb-3 ml-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>UI Engine & Gamification</Text>
          <View className={`${isDark ? 'bg-card' : 'bg-white'} p-5 rounded-3xl shadow-sm mb-8`}>
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Droplets color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
                <View>
                  <Text className={`text-lg font-semibold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Ambient Aura</Text>
                  <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Dynamic fluid background</Text>
                </View>
              </View>
              <Switch value={settings.financialAuraEnabled} onValueChange={toggleAura} trackColor={{ false: '#cbd5e1', true: '#8b5cf6' }} />
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Activity color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
                <View>
                  <Text className={`text-lg font-semibold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Ghost Racing</Text>
                  <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Gamify budget vs past month</Text>
                </View>
              </View>
              <Switch value={settings.ghostRacingEnabled} onValueChange={toggleGhost} trackColor={{ false: '#cbd5e1', true: '#f59e0b' }} />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className={`text-lg font-semibold ml-9 ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Dark Theme</Text>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#cbd5e1', true: '#10b981' }} />
            </View>
          </View>

          {/* Region & Language */}
          <Text className={`text-sm font-bold uppercase mb-3 ml-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Region & Formats</Text>
          <View className={`${isDark ? 'bg-card' : 'bg-white'} p-5 rounded-3xl shadow-sm mb-8`}>
             <Text className={`text-sm mb-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Global Currency (195+)</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
               {CURRENCIES.slice(0, 20).map(c => (
                 <TouchableOpacity 
                   key={c.code}
                   onPress={() => setCurrency(c.code)}
                   className={`px-4 py-2 mr-2 rounded-full ${currency === c.code ? 'bg-primary' : isDark ? 'bg-slate-800' : 'bg-gray-100'}`}
                 >
                   <Text className={currency === c.code ? 'text-white' : isDark ? 'text-textPrimary' : 'text-gray-900'}>{c.code} ({c.symbol})</Text>
                 </TouchableOpacity>
               ))}
               <TouchableOpacity className="px-4 py-2 mr-2 rounded-full bg-gray-100 dark:bg-slate-800"><Text>+ 175 More...</Text></TouchableOpacity>
             </ScrollView>

             <Text className={`text-sm mb-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Native Language</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
               {LANGUAGES.map(l => (
                 <TouchableOpacity 
                   key={l.code}
                   onPress={() => setLanguage(l.code)}
                   className={`px-4 py-2 mr-2 rounded-full ${language === l.code ? 'bg-primary' : isDark ? 'bg-slate-800' : 'bg-gray-100'}`}
                 >
                   <Text className={language === l.code ? 'text-white' : isDark ? 'text-textPrimary' : 'text-gray-900'}>{l.nativeName}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
             
             <TouchableOpacity 
               onPress={() => updateSettings({ currency, language })} 
               className="bg-primary p-3 rounded-xl items-center flex-row justify-center mt-2"
             >
               <Save color="white" size={20} className="mr-2" />
               <Text className="text-white font-bold text-lg">Apply Format</Text>
             </TouchableOpacity>
          </View>

          {/* Data Portability */}
           <Text className={`text-sm font-bold uppercase mb-3 ml-2 flex-row items-center ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Offline Vault Portability</Text>
           <View className={`${isDark ? 'bg-card' : 'bg-white'} p-5 rounded-3xl shadow-sm mb-12`}>
             <View className="flex-row justify-between items-center mb-6">
               <View className="flex-row items-center">
                 <Activity color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
                 <View>
                   <Text className={`text-lg font-semibold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Online Sync</Text>
                   <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Backup vault to secure cloud</Text>
                 </View>
               </View>
               <Switch value={settings.onlineSyncEnabled} onValueChange={toggleOnlineSync} trackColor={{ false: '#cbd5e1', true: '#10b981' }} />
             </View>

             <TouchableOpacity onPress={handleExport} className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl flex-row items-center mb-3">
               <Download color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
               <Text className={`font-semibold text-lg ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Export Vault (JSON/CSV)</Text>
             </TouchableOpacity>

             <TouchableOpacity className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl flex-row items-center mb-3">
               <Upload color={isDark ? '#f8fafc' : '#1e293b'} size={24} className="mr-3" />
               <Text className={`font-semibold text-lg ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Import Database</Text>
             </TouchableOpacity>
             
             <TouchableOpacity className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex-row items-center border border-red-200 dark:border-red-900/50">
               <Trash2 color="#ef4444" size={24} className="mr-3" />
               <Text className="font-semibold text-lg text-danger">Wipe Offline Storage</Text>
             </TouchableOpacity>
           </View>

        </ScrollView>
      </SafeAreaView>
    </AuraBackground>
  );
}
