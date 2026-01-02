import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BannerProps {
  title: string;
  subtitle: string;
  colors: [string, string];
}

export default function Banner({ title, subtitle, colors }: BannerProps) {
  return (
    <LinearGradient colors={colors} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 120,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
});