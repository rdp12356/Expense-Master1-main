import { TouchableOpacity, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../store/useSettingsStore';

export function FloatingActionButton() {
  const router = useRouter();
  const theme = useSettingsStore((state) => state.settings.theme);
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5, translateY: 50 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 20,
        alignSelf: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push('/add-transaction')}
        activeOpacity={0.8}
        className="w-16 h-16 rounded-full bg-primary items-center justify-center flex-row"
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>
    </MotiView>
  );
}
