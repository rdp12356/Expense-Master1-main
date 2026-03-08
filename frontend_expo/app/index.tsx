import React, { useMemo } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useTransactionStore } from '../src/store/useTransactionStore';
import { FloatingActionButton } from '../src/components/FAB';
import { ExpenseCharts } from '../src/components/Charts';
import { AuraBackground } from '../src/components/AuraBackground';
import { CURRENCIES } from '../src/utils/constants';
import { TrendingUp, Activity, MessageCircle } from 'lucide-react-native';

import { api } from '../src/services/api';
import { Globe } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const { transactions } = useTransactionStore();
  const { theme, currency, ghostRacingEnabled } = useSettingsStore((state) => state.settings);
  const isDark = theme === 'dark' || theme === 'system';
  const [benchmarks, setBenchmarks] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const res = await api.getBenchmarks();
        setBenchmarks(res.data);
      } catch (err) {
        console.warn('Failed to load benchmarks');
      }
    };
    fetchBenchmarks();
  }, []);

  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  }, [currency]);

  // General Totals
  const { totalBalance, income, expense } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount;
          acc.totalBalance += tx.amount;
        } else {
          acc.expense += tx.amount;
          acc.totalBalance -= tx.amount;
        }
        return acc;
      },
      { totalBalance: 0, income: 0, expense: 0 }
    );
  }, [transactions]);

  // Ghost Racing Logic (Current Month vs Last Month Expenses)
  const { thisMonthExp, lastMonthExp } = useMemo(() => {
    const now = new Date();
    let thisM = 0; let lastM = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const d = new Date(t.date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          thisM += t.amount;
        } else if (
          (now.getMonth() === 0 && d.getMonth() === 11 && d.getFullYear() === now.getFullYear() - 1) ||
          (d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear())
        ) {
          lastM += t.amount;
        }
      }
    });
    return { thisMonthExp: thisM, lastMonthExp: lastM };
  }, [transactions]);

  const beatingGhost = lastMonthExp > 0 && thisMonthExp <= lastMonthExp;
  const ghostText = lastMonthExp === 0
    ? "No data for ghost yet"
    : beatingGhost
      ? `Beating ghost by ${currencySymbol}${(lastMonthExp - thisMonthExp).toLocaleString()}`
      : `Falling behind ghost by ${currencySymbol}${(thisMonthExp - lastMonthExp).toLocaleString()}`;

  return (
    <AuraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView 
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="flex-row justify-between items-start mb-8 mt-4">
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 800 }}
            >
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} text-lg font-medium`}>
                Total Balance
              </Text>
              <MotiText 
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 200 }}
                className={`${isDark ? 'text-textPrimary' : 'text-gray-900'} text-5xl font-bold mt-1`}
              >
                {currencySymbol}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </MotiText>
            </MotiView>

            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => router.push('/support')}
                className={`p-3 rounded-full ${isDark ? 'bg-card' : 'bg-white'} shadow-sm mr-2`}
              >
                <MessageCircle color={isDark ? '#f8fafc' : '#1e293b'} size={24} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/settings')}
                className={`p-3 rounded-full ${isDark ? 'bg-card' : 'bg-white'} shadow-sm`}
              >
                 <Text className={isDark ? "text-white" : "text-black"}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ghost Racing Banner */}
          {ghostRacingEnabled && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 300, type: 'spring' }}
              className={`mb-6 p-4 rounded-2xl flex-row items-center border ${beatingGhost ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <Activity color={beatingGhost ? '#10b981' : '#ef4444'} size={24} className="mr-3" />
              <View>
                <Text className={`font-bold ${beatingGhost ? 'text-emerald-500' : 'text-red-500'}`}>
                  Ghost Racing {beatingGhost ? '🏎️💨' : '⚠️'}
                </Text>
                <Text className={isDark ? 'text-textSecondary' : 'text-gray-600'}>
                  {ghostText}
                </Text>
              </View>
            </MotiView>
          )}

          {/* Income / Expense Cards */}
          <View className="flex-row justify-between mb-6">
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: 400 }}
              className={`${isDark ? 'bg-card' : 'bg-white'} flex-1 p-4 rounded-3xl mr-2 shadow-sm`}
            >
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} text-sm`}>Income</Text>
              <Text className="text-primary text-xl font-bold mt-1">
                +{currencySymbol}{income.toLocaleString()}
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: 500 }}
              className={`${isDark ? 'bg-card' : 'bg-white'} flex-1 p-4 rounded-3xl ml-2 shadow-sm`}
            >
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} text-sm`}>Expense</Text>
              <Text className="text-danger text-xl font-bold mt-1">
                -{currencySymbol}{expense.toLocaleString()}
              </Text>
            </MotiView>
          </View>

          {/* Global Perspective (Benchmarks) */}
          {benchmarks.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className={`p-6 rounded-3xl mb-6 ${isDark ? 'bg-card/50' : 'bg-white/50'} border border-primary/20`}
            >
              <View className="flex-row items-center mb-4">
                <Globe color="#3b82f6" size={20} className="mr-2" />
                <Text className={`font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Global Perspective</Text>
              </View>
              <Text className={`text-xs mb-4 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
                How your emotional ROI compare to the ExpenseMaster community:
              </Text>
              {benchmarks.slice(0, 3).map((stat, i) => (
                <View key={stat.emotion} className="flex-row justify-between items-center mb-2">
                  <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-600'} capitalize`}>{stat.emotion}</Text>
                  <View className="flex-row items-center">
                    <Text className={`font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
                      {currencySymbol}{Math.round(stat.avgAmount).toLocaleString()} avg
                    </Text>
                  </View>
                </View>
              ))}
            </MotiView>
          )}

          {/* Butterfly Simulator Link */}
          <MotiView
             from={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 600 }}
          >
             <TouchableOpacity 
               onPress={() => router.push('/simulator')}
               className="bg-primary p-4 rounded-2xl mb-6 shadow-sm flex-row items-center justify-between"
             >
                <View className="flex-row items-center">
                  <TrendingUp color="white" size={24} className="mr-3" />
                  <Text className="text-white font-bold text-lg">The Butterfly Effect</Text>
                </View>
                <Text className="text-white/80">Simulate ➔</Text>
             </TouchableOpacity>
          </MotiView>

          {/* Expense Charts (Includes Emotional ROI) */}
          <ExpenseCharts />
          
          {/* Recent Transactions List */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 600 }}
          >
            <Text className={`${isDark ? 'text-textPrimary' : 'text-gray-900'} text-xl font-bold mb-4`}>
              Recent Transactions
            </Text>

            {transactions.slice(0, 5).map((tx, index) => (
              <MotiView 
               key={tx.id}
               from={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ type: 'spring', delay: 700 + (index * 100) }}
               className={`flex-row justify-between items-center p-4 mb-3 rounded-2xl ${isDark ? 'bg-card' : 'bg-white'} shadow-sm`}
              >
                <View>
                  <Text className={`${isDark ? 'text-textPrimary' : 'text-gray-900'} font-semibold text-base`}>
                    {tx.title} {tx.isBarter && '🤝'}
                  </Text>
                  <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} text-xs mt-1`}>
                    {new Date(tx.date).toLocaleDateString()} {tx.emotion && `• ${tx.emotion}`}
                  </Text>
                </View>
                <Text className={`${tx.type === 'income' ? 'text-primary' : 'text-danger'} font-bold`}>
                  {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                </Text>
              </MotiView>
            ))}
            
            {transactions.length === 0 && (
              <Text className={`${isDark ? 'text-textSecondary' : 'text-gray-500'} text-center mt-10`}>
                No transactions yet. Add one to get started!
              </Text>
            )}
          </MotiView>

        </ScrollView>

        <FloatingActionButton />
      </SafeAreaView>
    </AuraBackground>
  );
}
