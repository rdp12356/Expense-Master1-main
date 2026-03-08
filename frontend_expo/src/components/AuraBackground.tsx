import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, useAnimationState } from 'moti';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTransactionStore } from '../store/useTransactionStore';

export function AuraBackground({ children }: { children: React.ReactNode }) {
  const { financialAuraEnabled, theme } = useSettingsStore((state) => state.settings);
  const { transactions } = useTransactionStore();
  const isDark = theme === 'dark' || theme === 'system';

  let income = 0;
  let expense = 0;
  transactions.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });

  const healthRatio = income === 0 ? (expense > 0 ? 0 : 1) : Math.max(0, 1 - (expense / income));

  const auraState = useAnimationState({
    base: {
      scale: 1,
      opacity: 0.1,
    },
    pulse: {
      scale: 1.1,
      opacity: isDark ? 0.3 : 0.15,
    }
  });

  useEffect(() => {
    if (financialAuraEnabled) {
      // Loop the animation
      const interval = setInterval(() => {
        auraState.transitionTo((state) => (state === 'base' ? 'pulse' : 'base'));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [financialAuraEnabled]);

  const colors = (healthRatio > 0.5 
    ? ['#10b981', '#3b82f6'] // Emerald to Blue (Healthy)
    : healthRatio > 0.2
      ? ['#f59e0b', '#ef4444'] // Amber to Red (Warning)
      : ['#dc2626', '#991b1b']) as readonly [string, string, ...string[]]; // Deep Red (Danger)

  if (!financialAuraEnabled) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MotiView
        state={auraState}
        transition={{ type: 'timing', duration: 3000 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <LinearGradient
          colors={colors}
          style={[StyleSheet.absoluteFill, { opacity: isDark ? 0.4 : 0.1 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </MotiView>
      {children}
    </View>
  );
}
