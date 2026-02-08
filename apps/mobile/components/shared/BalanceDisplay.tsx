// apps/mobile/components/layout/BalanceDisplay.tsx
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useUserBalance } from '../../src/hooks/consumerHooks';
import { Image } from 'expo-image';


export default function BalanceDisplay() {
  const { data: balance, isLoading } = useUserBalance();

  const getNumericBalance = (b: any): number => {
    if (b == null) return 0;
    if (typeof b === 'number') return b;
    if (typeof b === 'string') {
      const parsed = Number(b);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof b === 'object') {
      if ('amount' in b && typeof (b as any).amount === 'number') return (b as any).amount;
      if ('balance' in b && typeof (b as any).balance === 'number') return (b as any).balance;
      if ('value' in b && typeof (b as any).value === 'number') return (b as any).value;
      if ('points' in b && typeof (b as any).points === 'number') return (b as any).points;
    }
    return 0;
  };

  const numericBalance = getNumericBalance(balance?.availableBalance);

  const formattedBalance = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericBalance);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/images/coin.png')} 
        style={{ width: 24, height: 24 }}
        />
        {/* <Coins color="#F59E0B" size={16} /> */}
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <View style={styles.balanceContent}>
          <Text style={styles.balanceAmount}>{formattedBalance}</Text>
          <Text style={styles.balanceLabel}>pts</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
});