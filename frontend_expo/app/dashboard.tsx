import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Animated Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.header}
        >
          <Text style={styles.title}>Expense Master</Text>
          <Text style={styles.subtitle}>Premium Open Source Tracking</Text>
        </MotiView>

        {/* Animated Balance Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 300, damping: 15 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <MotiText 
            from={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 600, duration: 800 }} 
            style={styles.balanceAmount}
          >
            $12,450.00
          </MotiText>
        </MotiView>

        {/* Staggered Quick Actions / Transactions Demo */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {[
            { id: 1, title: 'Apple Store', amount: '-$999.00', date: 'Today' },
            { id: 2, title: 'Freelance Payout', amount: '+$3,200.00', date: 'Yesterday', positive: true },
            { id: 3, title: 'Coffee Shop', amount: '-$4.50', date: 'Yesterday' }
          ].map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', delay: 800 + (index * 150), duration: 500 }}
              style={styles.transactionRow}
            >
              <View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, item.positive && styles.positiveAmount]}>
                {item.amount}
              </Text>
            </MotiView>
          ))}
        </View>

        {/* Pulsing Floating Action Button */}
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
          }}
          style={styles.fabContainer}
        >
          <View style={styles.fab}>
            <Plus color="#ffffff" size={32} />
          </View>
        </MotiView>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc', // Slate 50
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Slate 400
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#10b981', // Emerald 500
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  transactionsContainer: {
    marginTop: 40,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b', // Slate 800
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  transactionDate: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  positiveAmount: {
    color: '#10b981',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
