import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VideoControlsProps {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
  onNext: () => void;
  onPrev?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function VideoControls({
  isLiked,
  onLike,
  onShare,
  onSave,
  onNext,
  size = 'lg',
}: VideoControlsProps) {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 28 : 32;
  const textSize = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Feather
            name="heart"
            size={iconSize}
            color={isLiked ? '#EF4444' : '#FFFFFF'}
            style={isLiked ? styles.likedIcon : undefined}
          />
        </View>
        <Text style={[styles.label, { fontSize: textSize }]}>Me gusta</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={onSave}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Feather name="bookmark" size={iconSize} color="#FFFFFF" />
        </View>
        <Text style={[styles.label, { fontSize: textSize }]}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onNext}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Feather name="skip-forward" size={iconSize} color="#FFFFFF" />
        </View>
        <Text style={[styles.label, { fontSize: textSize }]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
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
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  likedIcon: {
    color: '#EF4444',
  },
});