// apps/mobile/components/layout/TopBar.tsx
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BalanceDisplay from './BalanceDisplay';

interface TopBarProps {
  onProfilePress: () => void;
  onBalancePress: () => void;
}

export default function TopBar({ onProfilePress, onBalancePress }: TopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Profile a la izquierda */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.profileIconContainer}>
            <User color="#007AFF" size={20} />
          </View>
        </TouchableOpacity>

        {/* Logo centrado */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Verygana</Text>
        </View>

        <TouchableOpacity
          style={styles.balanceButton}
          onPress={onBalancePress}
          activeOpacity={0.7}
        >
          <BalanceDisplay />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  balanceButton: {
    padding: 4,
  },
});