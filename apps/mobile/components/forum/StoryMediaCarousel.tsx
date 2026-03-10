import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { StoryMediaResponse } from '../../src/types/impactStory.types';

// Aspect ratio 16:9
const ASPECT_RATIO = 9 / 16;

// ─── Thumbnail inference ──────────────────────────────────────────────────────

async function inferThumbnail(media: StoryMediaResponse): Promise<string | null> {
  if (media.thumbnailUrl) return media.thumbnailUrl;
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(media.publicUrl, { time: 1000 });
    return uri;
  } catch {
    return null;
  }
}

// ─── VideoSlide ───────────────────────────────────────────────────────────────

function VideoSlide({
  media,
  width,
  height,
  isActive,
  onPlayingChange,
}: {
  media: StoryMediaResponse;
  width: number;
  height: number;
  isActive: boolean;
  onPlayingChange: (playing: boolean) => void;
}) {
  const [playing,   setPlaying]   = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(media.thumbnailUrl ?? null);

  // Player is created once for the lifetime of this slide
  const player = useVideoPlayer(media.publicUrl, (p) => {
    p.loop = false;
    p.muted = false;
    p.pause();
  });

  // Generate thumbnail if the server didn't provide one
  useEffect(() => {
    if (!media.thumbnailUrl) {
      inferThumbnail(media).then(setThumbnail);
    }
  }, [media.publicUrl]);

  // When this slide is no longer the active one (swipe away OR card scrolled off screen)
  // immediately pause and reset so the poster is shown again
  useEffect(() => {
    if (!isActive) {
      player.pause();
      try { player.seekBy(-player.currentTime); } catch { /* ignore if currentTime unavailable */ }
      setPlaying(false);
      onPlayingChange(false);
    }
  }, [isActive]);

  // Detect natural end-of-playback → return to poster
  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      try { player.seekBy(-player.currentTime); } catch {}
      setPlaying(false);
      onPlayingChange(false);
    });
    return () => sub.remove();
  }, [player]);

  const handlePressPlay = () => {
    player.play();
    setPlaying(true);
    onPlayingChange(true);
  };

  return (
    <View style={{ width, height, backgroundColor: '#111827' }}>
      {/* ── VideoView always mounted to avoid black-screen on first render ── */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        nativeControls={playing}
        allowsPictureInPicture={false}
      />

      {/* ── Poster overlay — sits on top of VideoView, removed once playing ── */}
      {!playing && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#111827' }]}
          pointerEvents="box-none"
        >
          {/* Thumbnail */}
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1F2937' }]} />
          )}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.22)' }]} />

          {/* Play button */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, styles.center]}
            onPress={handlePressPlay}
            activeOpacity={0.85}
            accessibilityLabel="Reproducir video"
            accessibilityRole="button"
          >
            <View style={styles.playBtn}>
              <Play color="#065F46" size={28} fill="#065F46" style={{ marginLeft: 3 }} />
            </View>
          </TouchableOpacity>

          {/* Video badge */}
          <View style={styles.videoBadge} pointerEvents="none">
            <Play color="#fff" size={10} fill="#fff" />
            <Text style={styles.videoBadgeText}>Video</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── ImageSlide ───────────────────────────────────────────────────────────────

function ImageSlide({ media, width, height }: { media: StoryMediaResponse; width: number; height: number }) {
  return (
    <View style={{ width, height, backgroundColor: '#111827' }}>
      <Image
        source={{ uri: media.publicUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StoryMediaCarouselProps {
  files:    StoryMediaResponse[];
  title:    string;
  category?: string;
  width?:   number;
  /** Called whenever the visible slide index changes */
  onIndexChange?: (index: number, total: number) => void;
  /**
   * Set to false when the card is scrolled off-screen (from FlatList
   * viewability tracking). All playing videos will be paused automatically.
   */
  isVisible?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Educación':       { bg: '#DBEAFE', text: '#1D4ED8' },
  'Salud':           { bg: '#FEE2E2', text: '#B91C1C' },
  'Medio Ambiente':  { bg: '#DCFCE7', text: '#15803D' },
  'Comunidad':       { bg: '#FEF3C7', text: '#B45309' },
  'Infraestructura': { bg: '#F1F5F9', text: '#475569' },
  'Emprendimiento':  { bg: '#EDE9FE', text: '#6D28D9' },
  'Alimentación':    { bg: '#FFEDD5', text: '#C2410C' },
  'Tecnología':      { bg: '#CFFAFE', text: '#0E7490' },
  'Otro':            { bg: '#F3F4F6', text: '#4B5563' },
};

// ─── StoryMediaCarousel ───────────────────────────────────────────────────────

export default function StoryMediaCarousel({
  files,
  category,
  width: propWidth,
  onIndexChange,
  isVisible = true,
}: StoryMediaCarouselProps) {
  const [measuredW,      setMeasuredW]      = useState<number>(propWidth ?? 0);
  const [index,          setIndex]          = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const total = files.length;

  const W = propWidth ?? measuredW;
  // Pure slide height — no bottom bar baked in anymore
  const H = W > 0 ? Math.round(W * ASPECT_RATIO) : 0;

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(i, total - 1));
    scrollRef.current?.scrollTo({ x: next * W, animated: true });
    setIndex(next);
    onIndexChange?.(next, total);
  }, [total, W, onIndexChange]);

  const catStyle = category
    ? (CATEGORY_COLORS[category] ?? { bg: '#F3F4F6', text: '#4B5563' })
    : null;

  return (
    <View
      style={[
        styles.wrapper,
        propWidth ? { width: propWidth, height: H } : { alignSelf: 'stretch', height: H || undefined },
      ]}
      onLayout={(e) => {
        if (!propWidth) {
          const w = Math.round(e.nativeEvent.layout.width);
          if (w !== measuredW) {
            setMeasuredW(w);
            onIndexChange?.(index, total);
          }
        }
      }}
    >
      {W > 0 && (
        <>
          {/* ── Slides ── */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / W);
              setIndex(newIndex);
              onIndexChange?.(newIndex, total);
            }}
            style={{ width: W, height: H, zIndex: isVideoPlaying ? 30 : 5 }}
            scrollEnabled={total > 1 && !isVideoPlaying}
            accessibilityLabel={`Carrusel de medios, ${total} elementos`}
          >
            {files.map((media, i) =>
              media.mediaType === 'VIDEO' ? (
                <VideoSlide
                  key={media.id}
                  media={media}
                  width={W}
                  height={H}
                  isActive={i === index && isVisible}
                  onPlayingChange={setIsVideoPlaying}
                />
              ) : (
                <ImageSlide key={media.id} media={media} width={W} height={H} />
              )
            )}
          </ScrollView>

          {/* ── Category badge ── */}
          {catStyle && category && (
            <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
              <Text style={[styles.categoryText, { color: catStyle.text }]}>{category}</Text>
            </View>
          )}

          {/* ── Arrows — only shown when not playing video ── */}
          {total > 1 && index > 0 && !isVideoPlaying && (
            <TouchableOpacity
              style={[styles.arrow, styles.arrowLeft, { top: H / 2 - 18 }]}
              onPress={() => goTo(index - 1)}
              activeOpacity={0.75}
              accessibilityLabel="Anterior"
              accessibilityRole="button"
            >
              <ChevronLeft color="#fff" size={20} />
            </TouchableOpacity>
          )}
          {total > 1 && index < total - 1 && !isVideoPlaying && (
            <TouchableOpacity
              style={[styles.arrow, styles.arrowRight, { top: H / 2 - 18 }]}
              onPress={() => goTo(index + 1)}
              activeOpacity={0.75}
              accessibilityLabel="Siguiente"
              accessibilityRole="button"
            >
              <ChevronRight color="#fff" size={20} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#111827',
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 6 },
    }),
  },
  videoBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  arrow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  arrowLeft:  { left: 8 },
  arrowRight: { right: 8 },
});