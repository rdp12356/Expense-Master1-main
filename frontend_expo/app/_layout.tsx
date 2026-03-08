import '../src/styles/global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { View } from 'react-native';

export default function RootLayout() {
  const theme = useSettingsStore((state) => state.settings.theme);
  
  // In a real app we would use react-native's useColorScheme to resolve 'system'
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <View style={{ flex: 1 }} className={isDark ? 'bg-background' : 'bg-gray-50'}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="support" />
        <Stack.Screen 
          name="add-transaction" 
          options={{ presentation: 'modal' }} 
        />
      </Stack>
    </View>
  );
}
