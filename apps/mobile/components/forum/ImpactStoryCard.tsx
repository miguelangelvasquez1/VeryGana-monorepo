import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Users, DollarSign, MapPin, Calendar, Tag } from 'lucide-react-native';
import StoryMediaCarousel from './StoryMediaCarousel';
import type { ImpactStoryResponse } from '../../src/types/impactStory.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(dateStr));
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);
}

const DESC_LIMIT = 160;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImpactStoryCardProps {
  story: ImpactStoryResponse;
  /** Passed from FlatList viewability — pauses videos when card is off-screen */
  isVisible?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImpactStoryCard({ story, isVisible = true }: ImpactStoryCardProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselTotal, setCarouselTotal] = useState(0);

  // Sort: isCover first, then displayOrder
  const sortedMedia = [...story.mediaFiles].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return  1;
    return a.displayOrder - b.displayOrder;
  });

  const tags = story.tags
    ? story.tags.split(',').map((t: any) => t.trim()).filter(Boolean)
    : [];

  const isLongDesc = story.description.length > DESC_LIMIT;
  const displayDesc = isLongDesc && !descExpanded
    ? story.description.slice(0, DESC_LIMIT).trimEnd() + '…'
    : story.description;

  const handleIndexChange = useCallback((index: number, total: number) => {
    setCarouselIndex(index);
    setCarouselTotal(total);
  }, []);

  const hasMedia   = sortedMedia.length > 0;
  const multiMedia = sortedMedia.length > 1;

  return (
    <View style={styles.card}>

      {/* ── Media carousel ── */}
      {hasMedia && (
        <>
          <StoryMediaCarousel
            files={sortedMedia}
            title={story.title}
            category={story.category}
            onIndexChange={handleIndexChange}
            isVisible={isVisible}
          />

          {/* ── External paginator — lives OUTSIDE the carousel, safe from video z-index ── */}
          {multiMedia && (
            <View style={styles.paginatorRow}>
              {/* Dots */}
              <View style={styles.dotsRow}>
                {sortedMedia.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === carouselIndex ? styles.dotActive : styles.dotInactive,
                    ]}
                    accessibilityLabel={`Slide ${i + 1} de ${carouselTotal}${i === carouselIndex ? ', actual' : ''}`}
                  />
                ))}
              </View>

              {/* Counter pill */}
              <View style={styles.counterPill}>
                <Text style={styles.counterText}>
                  {carouselIndex + 1} / {sortedMedia.length}
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Category badge when no media */}
        {story.category && !hasMedia && (
          <View style={styles.categoryBadgeInline}>
            <Text style={styles.categoryBadgeText}>{story.category}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{story.title}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <MetaItem icon={<Calendar color="#9CA3AF" size={13} />} label={formatDate(story.storyDate)} />
          {story.location && (
            <MetaItem icon={<MapPin color="#9CA3AF" size={13} />} label={story.location} />
          )}
        </View>

        {story.authorName && (
          <Text style={styles.author}>
            por <Text style={styles.authorName}>{story.authorName}</Text>
          </Text>
        )}

        {/* Description */}
        <Text style={styles.description}>{displayDesc}</Text>
        {isLongDesc && (
          <TouchableOpacity
            onPress={() => setDescExpanded((v) => !v)}
            activeOpacity={0.7}
            accessibilityLabel={descExpanded ? 'Ver menos descripción' : 'Ver más descripción'}
            accessibilityRole="button"
          >
            <Text style={styles.descToggle}>
              {descExpanded ? 'Ver menos ↑' : 'Ver más ↓'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatChip
            icon={<Users color="#1D4ED8" size={13} />}
            label={`${story.beneficiariesCount.toLocaleString('es-CO')} beneficiados`}
            bg="#EFF6FF"
            color="#1D4ED8"
          />
          {story.investedAmount > 0 && (
            <StatChip
              icon={<DollarSign color="#065F46" size={13} />}
              label={formatMoney(story.investedAmount, story.investedCurrency)}
              bg="#ECFDF5"
              color="#065F46"
            />
          )}
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag: any) => (
              <View key={tag} style={styles.tag}>
                <Tag color="#6B7280" size={10} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── MetaItem ─────────────────────────────────────────────────────────────────

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.metaItem}>
      {icon}
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

// ─── StatChip ─────────────────────────────────────────────────────────────────

function StatChip({
  icon, label, bg, color,
}: {
  icon: React.ReactNode; label: string; bg: string; color: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      {icon}
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  body: {
    padding: 16,
  },

  // ── External paginator ──
  paginatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 8,
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 99,
  },
  dotActive: {
    width: 18,
    height: 6,
    backgroundColor: '#059669',
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: '#D1D5DB',
  },
  counterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  counterText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Category badge (no-media fallback) ──
  categoryBadgeInline: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },

  // ── Text ──
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 23,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  author: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  authorName: {
    color: '#4B5563',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 4,
    marginTop: 6,
  },
  descToggle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 14,
    marginTop: 2,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Tags ──
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
});