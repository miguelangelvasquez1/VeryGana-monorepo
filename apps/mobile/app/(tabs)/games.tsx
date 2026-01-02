import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { GameCardResponseDTO } from '@verygana/types';
import { useAvailableGames, useInitGame } from '../../src/hooks/gameHooks';
import GameSection from '../../components/tabs/games/GameSection';
import Banner from '../../components/tabs/games/Banner';
import GameSearchBar from '../../components/tabs/games/GamesSearchBar';

export default function GamesPanelPage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
  } = useAvailableGames(0, 20);

  const initGameMutation = useInitGame();

  const sponsoredGames = useMemo(
    () => data?.content.filter((g) => g.sponsored) ?? [],
    [data]
  );

  const freeGames = useMemo(
    () => data?.content.filter((g) => !g.sponsored) ?? [],
    [data]
  );

  const onRefresh = async () => {
    try {
        // refetch devuelve una promise: podemos esperarla para controlar errores
        await refetch();
    } catch (err) {
        console.error('Error refrescando juegos', err);
    }
  };

  const handleSponsoredPlay = async () => {
    if (!sponsoredGames.length) return;

    try {
      const response = await initGameMutation.mutateAsync({
        gameId: sponsoredGames[0].id,
        sponsored: true,
      });

      router.push(`/games/play?token=${response.sessionToken}`);
    } catch (error) {
      console.error('Error initializing sponsored game', error);
    }
  };

  const handlePlay = async (game: GameCardResponseDTO) => {
    try {
      const response = await initGameMutation.mutateAsync({
        gameId: game.id,
        sponsored: false,
      });

      router.push(`/games/play?token=${response.sessionToken}`);
    } catch (error) {
      console.error('Error initializing game', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando juegos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Gana dinero jugando nuestros juegos patrocinados
        </Text>
        <Text style={styles.heroSubtitle}>
          Disfruta de una variedad de juegos diseñados para entretenerte y
          ofrecerte la oportunidad de ganar premios reales. ¡Empieza a jugar
          ahora y convierte tu diversión en ganancias!
        </Text>
      </View>

      {/* Banner */}
      <Banner
        title="Juega, gana y vuelve a intentarlo"
        subtitle="Cada partida puede acercarte a tu próxima recompensa"
        colors={['#4C1D95', '#2563EB']}
      />

      {/* Search Bar */}
      <GameSearchBar />

      {/* Sponsored Games */}
      <View style={styles.sponsoredContainer}>
        <View style={styles.sponsoredHeader}>
          <View style={styles.sponsoredTitleRow}>
            <Feather name="star" size={20} color="#EAB308" />
            <Text style={styles.sponsoredTitle}>Juegos Patrocinados</Text>
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handleSponsoredPlay}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>Jugar ahora 🎲</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sponsoredDescription}>
          Un juego se selecciona de forma aleatoria para garantizar igualdad
          entre anunciantes.
        </Text>

        <GameSection games={sponsoredGames} selectable={false} />
      </View>

      {/* Free Games Banner */}
      <Banner
        title="Juega y diviértete sin límites"
        subtitle="Diviértete con nuestros increíbles juegos gratuitos"
        colors={['#22C55E', '#16A34A']}
      />

      {/* Free Games */}
      <GameSection
        title="Juegos para divertirse"
        icon={<Feather name="disc" size={20} color="#3B82F6" />}
        games={freeGames}
        onGameClick={handlePlay}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  hero: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 24,
  },
  sponsoredContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    borderStyle: 'dashed',
  },
  sponsoredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sponsoredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sponsoredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  playButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  sponsoredDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
});