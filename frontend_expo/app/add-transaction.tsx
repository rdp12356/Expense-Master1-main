import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ChevronDown, X, Heart, BatteryCharging, Zap, CloudRain, Circle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useTransactionStore } from '../src/store/useTransactionStore';
import { TransactionType } from '../src/types';
import { AuraBackground } from '../src/components/AuraBackground';

const EMOTIONS = [
  { id: 'Joy', icon: Heart, color: '#10b981' },
  { id: 'Neutral', icon: Circle, color: '#94a3b8' },
  { id: 'Impulse', icon: Zap, color: '#f59e0b' },
  { id: 'Stress', icon: BatteryCharging, color: '#ef4444' },
  { id: 'Sadness', icon: CloudRain, color: '#6366f1' },
] as const;

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction, categories } = useTransactionStore();
  const { theme, currency } = useSettingsStore((state) => state.settings);
  const isDark = theme === 'dark' || theme === 'system';

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(categories[0].id);
  const [isBarter, setIsBarter] = useState(false);
  const [barterDesc, setBarterDesc] = useState('');
  const [emotion, setEmotion] = useState<typeof EMOTIONS[number]['id']>('Neutral');

  const handleSave = () => {
    if ((!isBarter && !amount) || !title) return;
    
    addTransaction({
      amount: isBarter ? 0 : parseFloat(amount),
      title,
      type,
      categoryId: category,
      currency,
      date: new Date().toISOString(),
      emotion: type === 'expense' ? emotion : undefined,
      isBarter,
      barterDescription: isBarter ? barterDesc : undefined,
    });
    
    router.back();
  };

  return (
    <AuraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']} className={`${isDark ? 'bg-background/90' : 'bg-gray-50/90'}`}>
        <MotiView
          from={{ opacity: 0, translateY: Platform.OS === 'ios' ? 300 : 100 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="flex-1 px-5 pt-8"
        >
          <View className="flex-row justify-between items-center mb-8">
            <Text className={`${isDark ? 'text-textPrimary' : 'text-gray-900'} text-3xl font-bold`}>
              New Entry
            </Text>
            <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-200 dark:bg-card">
              <X color={isDark ? '#f8fafc' : '#1e293b'} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Toggle Type & Barter */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row bg-gray-200 dark:bg-card rounded-full p-1 flex-1 mr-4">
                <TouchableOpacity 
                  onPress={() => setType('expense')}
                  className={`flex-1 py-3 rounded-full items-center ${type === 'expense' ? 'bg-danger shadow-sm' : ''}`}
                >
                  <Text className={`font-bold ${type === 'expense' ? 'text-white' : 'text-gray-500'}`}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setType('income')}
                  className={`flex-1 py-3 rounded-full items-center ${type === 'income' ? 'bg-primary shadow-sm' : ''}`}
                >
                  <Text className={`font-bold ${type === 'income' ? 'text-white' : 'text-gray-500'}`}>Income</Text>
                </TouchableOpacity>
              </View>

              <View className="items-center">
                <Text className={`text-xs font-bold mb-1 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Barter</Text>
                <Switch 
                  value={isBarter} 
                  onValueChange={setIsBarter}
                  trackColor={{ false: '#cbd5e1', true: '#8b5cf6' }}
                />
              </View>
            </View>

            {/* Amount / Barter Input */}
            <MotiView 
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 100 }}
              className="items-center mb-8"
            >
              {!isBarter ? (
                <>
                  <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} font-semibold mb-2`}>Amount</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#475569' : '#cbd5e1'}
                    className={`${isDark ? 'text-textPrimary' : 'text-gray-900'} text-6xl font-bold text-center border-b-2 ${type === 'expense' ? 'border-danger text-danger' : 'border-primary text-primary'} pb-2`}
                    style={{ minWidth: 200 }}
                  />
                </>
              ) : (
                <View className="w-full">
                  <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} font-semibold mb-2 ml-1 text-purple-500`}>What was traded?</Text>
                  <TextInput
                    value={barterDesc}
                    onChangeText={setBarterDesc}
                    placeholder="e.g. Fixed PC for 3 meals"
                    placeholderTextColor={isDark ? '#475569' : '#cbd5e1'}
                    className={`bg-purple-100 dark:bg-purple-900/20 text-textPrimary p-4 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800 text-lg`}
                    multiline
                  />
                </View>
              )}
            </MotiView>

            {/* Details */}
            <View className="mb-6">
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} font-semibold mb-2 ml-1`}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Morning Coffee"
                placeholderTextColor={isDark ? '#475569' : '#cbd5e1'}
                className={`${isDark ? 'bg-card text-textPrimary' : 'bg-white text-gray-900'} p-4 rounded-2xl shadow-sm text-lg`}
              />
            </View>

            {/* Category Picker */}
            <View className="mb-8">
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} font-semibold mb-2 ml-1`}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {categories.filter(c => c.type === type).map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    className={`px-5 py-3 rounded-full mr-3 border ${category === cat.id ? 'bg-primary border-primary' : isDark ? 'bg-card border-card' : 'bg-white border-white'}`}
                  >
                    <Text className={`font-bold ${category === cat.id ? 'text-white' : isDark ? 'text-textSecondary' : 'text-gray-600'}`}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Emotional ROI (Expenses Only) */}
            {type === 'expense' && !isBarter && (
              <View className="mb-10">
                <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} font-semibold mb-3 ml-1`}>How did this purchase feel?</Text>
                <View className="flex-row justify-between px-2">
                  {EMOTIONS.map((emo) => {
                    const Icon = emo.icon;
                    const isSelected = emotion === emo.id;
                    return (
                      <TouchableOpacity
                        key={emo.id}
                        onPress={() => setEmotion(emo.id)}
                        className={`items-center p-3 rounded-2xl border-2 ${isSelected ? 'shadow-sm' : 'border-transparent'}`}
                        style={{ borderColor: isSelected ? emo.color : 'transparent', backgroundColor: isSelected ? `${emo.color}20` : 'transparent' }}
                      >
                        <Icon color={isSelected ? emo.color : (isDark ? '#cbd5e1' : '#94a3b8')} size={28} />
                        <Text className={`text-xs mt-2 font-bold ${isSelected ? '' : 'text-gray-400'}`} style={{ color: isSelected ? emo.color : undefined }}>
                          {emo.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <TouchableOpacity 
              onPress={handleSave}
              activeOpacity={0.8}
              className={`${isBarter ? 'bg-purple-500 shadow-purple-500' : 'bg-primary shadow-primary'} rounded-2xl p-4 items-center mb-10 shadow-lg`}
            >
              <Text className="text-white font-bold text-xl">Save Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </MotiView>
      </SafeAreaView>
    </AuraBackground>
  );
}
