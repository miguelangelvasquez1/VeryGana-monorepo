import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ViewToken,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, AlertCircle, RefreshCw, ArrowLeft, HeartHandshake } from 'lucide-react-native';
import ImpactStoryCard from './ImpactStoryCard';
import { useImpactStories } from '../../src/hooks/useImpactStories';
import type { ImpactStoryResponse } from '../../src/types/impactStory.types';

const CARD_H_PADDING = 16;

// ─── Header ───────────────────────────────────────────────────────────────────

function FeedHeader({ total }: { total: number }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#065F46', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 12 }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.75}
        style={styles.backBtn}
      >
        <ArrowLeft color="#fff" size={20} />
      </TouchableOpacity>

      <View style={styles.headerIcon}>
        <HeartHandshake color="#fff" size={22} />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Historias de Impacto</Text>
        <Text style={styles.headerSub}>
          {total > 0 ? `${total} historias compartidas` : 'Cargando…'}
        </Text>
      </View>
    </LinearGradient>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <View style={styles.centered}>
      <View style={styles.emptyIcon}>
        <Leaf color="#D1FAE5" size={40} />
      </View>
      <Text style={styles.emptyTitle}>Aún no hay historias</Text>
      <Text style={styles.emptyBody}>Vuelve pronto para ver nuestras historias de impacto.</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRefresh} activeOpacity={0.8}>
        <RefreshCw color="#fff" size={16} />
        <Text style={styles.retryText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <AlertCircle color="#EF4444" size={44} />
      <Text style={styles.errorTitle}>Algo salió mal</Text>
      <Text style={styles.errorBody}>{message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <RefreshCw color="#fff" size={16} />
        <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Footer loader ────────────────────────────────────────────────────────────

function FooterLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator color="#059669" size="small" />
      <Text style={styles.footerText}>Cargando más…</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ImpactStoriesFeedScreen() {
  const {
    stories, loading, refreshing, loadingMore,
    hasMore, error, refresh, loadMore,
  } = useImpactStories();

  // Track which item IDs are currently visible on screen
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());

  // viewabilityConfig: item must be at least 50% visible to count as "visible"
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setVisibleIds(new Set(viewableItems.map((v) => v.item.id as number)));
    },
    []
  );

  // Full-screen loading
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#059669" size="large" />
        <Text style={styles.loadingText}>Cargando historias…</Text>
      </View>
    );
  }

  // Full-screen error (only on first load)
  if (error && stories.length === 0) {
    return (
      <View style={styles.container}>
        <FeedHeader total={0} />
        <ErrorState message={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList<ImpactStoryResponse>
        data={stories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: CARD_H_PADDING }}>
            <ImpactStoryCard
              story={item}
              isVisible={visibleIds.has(item.id)}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        // Pull-to-refresh
        refreshing={refreshing}
        onRefresh={refresh}
        // Infinite scroll
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.4}
        // Viewability — pauses off-screen videos
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListHeaderComponent={<FeedHeader total={stories.length} />}
        ListEmptyComponent={<EmptyState onRefresh={refresh} />}
        ListFooterComponent={<FooterLoader loading={loadingMore} />}
        showsVerticalScrollIndicator={false}
        // Performance
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={6}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#065F46',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  errorBody: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});