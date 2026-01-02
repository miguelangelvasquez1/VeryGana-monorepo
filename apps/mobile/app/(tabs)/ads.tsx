import { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Image } from 'expo-image';
import { useActiveAds } from '../../src/hooks/adHooks';
import { AdForConsumerDTO } from '@verygana/types';
import VideoControls from '../../components/tabs/ads/VideoControls';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoAdPlayerProps {
  page?: number;
  size?: number;
}

export default function VideoAdPlayer({ page = 0, size = 10 }: VideoAdPlayerProps) {
  const { data, isLoading, isError, error } = useActiveAds(page, size);

  const adsArray = useMemo<AdForConsumerDTO[]>(() => {
    if (!data) return [];
    if ((data as any).content) return (data as any).content;
    if ((data as any).items) return (data as any).items;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const medias = useMemo(
    () =>
      adsArray.map((ad) => ({
        id: ad.id,
        src: ad.contentUrl,
        title: ad.title,
        description: ad.description ?? '',
        brand: ad.advertiserName ?? 'Anunciante',
        likes: ad.currentLikes ?? 0,
        type: ad.mediaType ?? 'VIDEO',
        duration: ad.mediaType === 'VIDEO' ? 0 : 30,
      })),
    [adsArray]
  );

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isLiked, setIsLiked] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const videoRef = useRef<Video>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rewardOpacity = useRef(new Animated.Value(0)).current;
  const isSwitching = useRef(false);

  const currentMedia = medias[currentMediaIndex];

  const formattedLikes = useMemo(() => {
    if (!currentMedia) return '0';
    return new Intl.NumberFormat('es-CO').format(currentMedia.likes);
  }, [currentMedia?.likes]);

  // Gesture handler para swipe vertical
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (isSwitching.current) return;

      const threshold = 50;
      if (Math.abs(event.velocityY) > threshold) {
        isSwitching.current = true;
        setTimeout(() => {
          isSwitching.current = false;
        }, 500);

        if (event.velocityY < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    });

  // Reset cuando cambia la lista de medias
  useEffect(() => {
    if (medias.length === 0) {
      setCurrentMediaIndex(0);
      setIsPlaying(false);
      return;
    }
    if (currentMediaIndex >= medias.length) {
      setCurrentMediaIndex(0);
    }
  }, [medias.length, currentMediaIndex]);

  // Reset estados cuando cambia el media actual
  useEffect(() => {
    if (!currentMedia) return;

    setProgress(0);
    setWatchTime(0);
    setIsLiked(false);
    setShowReward(false);
    setDuration(currentMedia.type === 'IMAGE' ? 30 : 0);
  }, [currentMedia?.id]);

  // Manejo de reproducción
  useEffect(() => {
    if (!currentMedia) return;

    const isImage = currentMedia.type === 'IMAGE';

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isImage && isPlaying) {
      const imageDuration = 30;
      const startTime = Date.now() - watchTime * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed >= imageDuration) {
          clearInterval(timerRef.current!);
          handleNext();
          return;
        }

        setWatchTime(elapsed);
        setProgress((elapsed / imageDuration) * 100);

        if (elapsed / imageDuration > 0.8 && !showReward) {
          triggerReward();
        }
      }, 1000 / 60);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentMedia?.id, isPlaying, watchTime]);

  const triggerReward = () => {
    setShowReward(true);
    Animated.sequence([
      Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2700),
      Animated.timing(rewardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowReward(false));
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.durationMillis) {
      setDuration(status.durationMillis / 1000);
    }

    if (status.positionMillis !== undefined && status.durationMillis) {
      const currentTime = status.positionMillis / 1000;
      const dur = status.durationMillis / 1000;

      setProgress((currentTime / dur) * 100);
      setWatchTime(currentTime);

      if (currentTime / dur > 0.8 && !showReward) {
        triggerReward();
      }
    }

    if (status.didJustFinish) {
      handleNext();
    }

    setIsPlaying(status.isPlaying);
  };

  const togglePlayPause = async () => {
    const isImage = currentMedia?.type === 'IMAGE';

    if (isImage) {
      setIsPlaying((prev) => !prev);
    } else {
      const video = videoRef.current;
      if (!video) return;

      const status = await video.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await video.pauseAsync();
        } else {
          await video.playAsync();
        }
      }
    }
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    // TODO: Llamar API para registrar like
  };

  function handleNext() {
    setCurrentMediaIndex((prev) => (prev < medias.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  function handlePrev () {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : medias.length - 1));
    setIsPlaying(true);
  };

  const handleShare = () => {
    console.log('Compartir:', currentMedia);
    // TODO: Implementar compartir con Share API de Expo
  };

  const handleSave = () => {
    console.log('Guardar:', currentMedia);
    // TODO: Implementar guardar
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Cargando anuncios...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>⚠️ Error cargando anuncios</Text>
        <Text style={styles.errorMessage}>
          {(error as any)?.message ?? 'Error desconocido'}
        </Text>
      </View>
    );
  }

  if (!currentMedia) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay anuncios activos disponibles.</Text>
      </View>
    );
  }

  const isImage = currentMedia.type === 'IMAGE';

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Media */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={togglePlayPause}
          style={styles.mediaContainer}
        >
          {isImage ? (
            <Image
              source={{ uri: currentMedia.src }}
              style={styles.media}
              contentFit="contain"
              transition={300}
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentMedia.src }}
              style={styles.media}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isPlaying}
              isLooping={false}
              isMuted={false}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
          )}
        </TouchableOpacity>

        {/* Play overlay */}
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Media Info Overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandInitial}>
                {currentMedia.brand?.[0]?.toUpperCase() ?? 'A'}
              </Text>
            </View>
            <Text style={styles.brandName}>{currentMedia.brand}</Text>
          </View>

          <Text style={styles.title}>{currentMedia.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {currentMedia.description}
          </Text>

          <View style={styles.statsContainer}>
            <Text style={styles.stat}>❤️ {formattedLikes}</Text>
            <Text style={styles.stat}>
              ⏱️ {Math.floor(watchTime)}s / {Math.floor(duration)}s
            </Text>
          </View>
        </View>

        {/* Reward notification */}
        {showReward && (
          <Animated.View
            style={[styles.rewardContainer, { opacity: rewardOpacity }]}
          >
            <View style={styles.rewardCard}>
              <Text style={styles.rewardEmoji}>🎉</Text>
              <View>
                <Text style={styles.rewardTitle}>¡Recompensa desbloqueada!</Text>
                <Text style={styles.rewardSubtitle}>
                  Sigue viendo para ganar más
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <VideoControls
            isLiked={isLiked}
            onLike={handleLike}
            onShare={handleShare}
            onSave={handleSave}
            onNext={handleNext}
            onPrev={handlePrev}
            size="md"
          />
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  mediaContainer: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 24,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  rewardContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    zIndex: 30,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rewardEmoji: {
    fontSize: 32,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rewardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 96,
    zIndex: 30,
  },
});