import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VideoControlsProps {
  onVisit: () => void;
  onShare: () => void;
  onSave: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function VideoControls({
  onVisit,
  onShare,
  onSave,
  size = 'lg',
}: VideoControlsProps) {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 28 : 32;
  const textSize = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onVisit}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Feather name="external-link" size={iconSize} color="#FFFFFF" />
        </View>
        <Text style={[styles.label, { fontSize: textSize }]}>Visitar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onShare}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Feather name="share-2" size={iconSize} color="#FFFFFF" />
        </View>
        <Text style={[styles.label, { fontSize: textSize }]}>Compartir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});