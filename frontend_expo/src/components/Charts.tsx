import React, { useMemo } from 'react';
import { View, Dimensions, Text, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { MotiView } from 'moti';

const screenWidth = Dimensions.get('window').width;

const EMOTION_COLORS: Record<string, string> = {
  'Joy': '#10b981', // Emerald
  'Stress': '#ef4444', // Red
  'Impulse': '#f59e0b', // Amber
  'Sadness': '#6366f1', // Indigo
  'Neutral': '#94a3b8', // Slate
};

export function ExpenseCharts() {
  const { transactions, categories } = useTransactionStore();
  const theme = useSettingsStore((state) => state.settings.theme);
  const isDark = theme === 'dark' || theme === 'system';
  
  const textColor = isDark ? '#f8fafc' : '#1e293b';

  // Format data for Pie Chart (Category Spending)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && !t.isBarter);
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return {
        value: amount,
        color: cat?.color || '#ef4444',
        text: cat?.name || 'Other',
      };
    });
  }, [transactions, categories]);

  // Format data for Bar Chart (Income vs Expense)
  const barData = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if(!t.isBarter) {
         t.type === 'income' ? inc += t.amount : exp += t.amount;
      }
    });
    return [
      { value: inc, label: 'Income', frontColor: '#10b981' },
      { value: exp, label: 'Expense', frontColor: '#ef4444' },
    ];
  }, [transactions]);

  // Emotional ROI Pie Chart
  const emotionData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && t.emotion);
    const emotionTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      if (t.emotion) emotionTotals[t.emotion] = (emotionTotals[t.emotion] || 0) + t.amount;
    });

    return Object.entries(emotionTotals).map(([emotion, amount]) => {
      return {
        value: amount,
        color: EMOTION_COLORS[emotion] || '#ef4444',
        text: emotion,
      };
    });
  }, [transactions]);

  if (transactions.length === 0) return null;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 400 }}
      className="mt-2 mb-6"
    >
      <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
        Analytics
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4 pt-2">
        {/* Income vs Expense Bar Chart */}
        <View className={`${isDark ? 'bg-card' : 'bg-white'} p-4 rounded-3xl mr-4 shadow-sm w-[300px] items-center`}>
          <Text className={`font-semibold mb-6 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
            Income vs Expense
          </Text>
          <BarChart
            data={barData}
            barWidth={40}
            spacing={40}
            roundedTop
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: textColor }}
            noOfSections={3}
            maxValue={Math.max(barData[0]?.value || 1, barData[1]?.value || 1, 100)}
          />
        </View>

        {/* Category Spending Pie Chart */}
        {pieData.length > 0 && (
          <View className={`${isDark ? 'bg-card' : 'bg-white'} p-4 rounded-3xl mr-4 shadow-sm w-[300px] items-center`}>
            <Text className={`font-semibold mb-6 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
              Category Breakdown
            </Text>
            <PieChart
              data={pieData}
              donut
              showText
              textColor="white"
              radius={80}
              innerRadius={50}
              shadow
            />
          </View>
        )}

        {/* Emotional ROI Pie Chart */}
        {emotionData.length > 0 && (
          <View className={`${isDark ? 'bg-card' : 'bg-white'} p-4 rounded-3xl mr-4 shadow-sm w-[300px] items-center`}>
            <Text className={`font-semibold mb-6 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
              Emotional ROI
            </Text>
            <PieChart
              data={emotionData}
              donut
              showText
              textColor="white"
              radius={80}
              innerRadius={50}
              shadow
            />
          </View>
        )}
      </ScrollView>
    </MotiView>
  );
}
