import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, MotiText } from 'moti';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { CURRENCIES } from '../src/utils/constants';
import { AuraBackground } from '../src/components/AuraBackground';

import { Share, ActivityIndicator } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { api } from '../services/api';

export default function Simulator() {
  const router = useRouter();
  const { theme, currency } = useSettingsStore(s => s.settings);
  const isDark = theme === 'dark' || theme === 'system';
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  
  const [dailyHabit, setDailyHabit] = useState('5');
  const [isSharing, setIsSharing] = useState(false);
  const amount = parseFloat(dailyHabit) || 0;
  
  // FV = P * (((1 + r)^n - 1) / r)
  const annualContrib = amount * 365;
  const rate = 0.07; // 7% market return
  const years = 10;
  const futureValue = annualContrib * (((Math.pow(1 + rate, years) - 1)) / rate);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const res = await api.saveSimulation({
        habitName: "Daily Habit",
        dailyCost: amount,
        projectedWealth: futureValue,
        years: years
      });
      const shareUrl = `https://expensemaster.global/s/${res.data.id}`;
      
      await Share.share({
        message: `I just simulated my financial future! My $${amount}/day habit is costing me $${futureValue.toLocaleString()} over 10 years. Realize your own potential here: ${shareUrl}`,
        url: shareUrl,
        title: 'ExpenseMaster Wealth Simulation'
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <AuraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-background/80' : 'bg-gray-50/80'}`}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="flex-row items-center mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-gray-200 dark:bg-card rounded-full">
              <ChevronLeft color={isDark ? '#f8fafc' : '#1e293b'} size={24} />
            </TouchableOpacity>
            <Text className={`text-2xl font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
              The Butterfly Effect
            </Text>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className={`p-6 rounded-3xl ${isDark ? 'bg-card' : 'bg-white'} shadow-sm mb-8`}
          >
            <Text className={`text-lg mb-4 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
              What is the cost of your daily habit? Enter a small daily expense (like coffee or a snack) to see its 10-year compounding impact.
            </Text>

            <View className="flex-row items-center justify-center border-b-2 border-primary pb-2 mb-2 mx-auto w-1/2">
              <Text className={`text-4xl font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'} mr-1`}>{symbol}</Text>
              <TextInput
                value={dailyHabit}
                onChangeText={setDailyHabit}
                keyboardType="decimal-pad"
                className={`text-6xl font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}
                maxLength={4}
              />
            </View>
            <Text className={`text-center font-semibold ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>per day</Text>
          </MotiView>

          <MotiView
            from={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 300, damping: 15 }}
            className="items-center"
          >
            <Text className={`text-xl mb-2 font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
              In 10 years, it costs you:
            </Text>
            
            <MotiText
              key={futureValue}
              from={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-6xl font-black text-center my-4"
              style={{ color: isDark ? '#10b981' : '#047857' }}
            >
              {symbol}{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </MotiText>
            
            <Text className={`text-center mt-2 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
              Assuming this money was invested at a 7% average annual return instead of spent. Small changes ripple into massive wealth!
            </Text>

            <TouchableOpacity 
              onPress={handleShare}
              disabled={isSharing}
              className={`mt-8 flex-row items-center justify-center px-8 py-4 rounded-2xl ${isDark ? 'bg-primary' : 'bg-primary'} w-full`}
            >
              {isSharing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Share2 color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg">Share Projections</Text>
                </>
              )}
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </AuraBackground>
  );
}
