import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GameCardResponseDTO } from '@verygana/types';
import GameCard from './GameCard';

interface GameSectionProps {
  title?: string;
  icon?: React.ReactNode;
  games: GameCardResponseDTO[];
  selectable?: boolean;
  onGameClick?: (game: GameCardResponseDTO) => void;
}

export default function GameSection({
  title,
  icon,
  games,
  selectable = true,
  onGameClick,
}: GameSectionProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          {icon}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            selectable={selectable}
            onClick={
              selectable && onGameClick ? () => onGameClick(item) : undefined
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});