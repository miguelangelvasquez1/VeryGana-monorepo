import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { GameCardResponseDTO } from '@verygana/types';

interface GameCardProps {
  game: GameCardResponseDTO;
  selectable?: boolean;
  onClick?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3; // 3 columnas con padding

export default function GameCard({
  game,
  selectable = true,
  onClick,
}: GameCardProps) {
  const CardWrapper = selectable && onClick ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.card, !selectable && styles.cardDisabled]}
      onPress={onClick}
      activeOpacity={0.7}
      disabled={!selectable}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: game.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {game.sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>⭐</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {game.title}
      </Text>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sponsoredText: {
    fontSize: 12,
  },
  title: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 16,
  },
});