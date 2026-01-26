import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Share,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Image } from 'expo-image';
import { useNextAd, useLikeAd } from '../../src/hooks/adHooks';
import { AdForConsumerDTO } from '@verygana/types';
import VideoControls from '../../components/tabs/ads/VideoControls';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoAdPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isLiked, setIsLiked] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdForConsumerDTO | null>(null);

  const insets = useSafeAreaInsets();

  const timerRef = useRef<number | null>(null);
  const rewardOpacity = useRef(new Animated.Value(0)).current;

  // Crear el player de video
  const player = useVideoPlayer(
    currentAd?.mediaType === 'VIDEO' ? currentAd.contentUrl : '',
    (player) => {
      player.loop = false;
      player.muted = false;
    }
  );

  const { mutate: getNextAd, isPending: isLoadingAd } = useNextAd();
  const { mutate: likeAd, isPending: isLikingAd } = useLikeAd();

  useEffect(() => {
    loadNextAd();
  }, []);

  // Actualizar el source del player cuando cambia el ad
  useEffect(() => {
    if (currentAd?.mediaType === 'VIDEO' && currentAd.contentUrl) {
      player.replaceAsync(currentAd.contentUrl);
      player.play();
    }
  }, [currentAd?.id]);

  // Listener para el estado del video
  useEffect(() => {
    if (!currentAd || currentAd.mediaType !== 'VIDEO') return;

    const subscription = player.addListener('playingChange', (event) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [currentAd?.id, player]);

  // Listener para el progreso del video
  useEffect(() => {
    if (!currentAd || currentAd.mediaType !== 'VIDEO') return;

    const interval = setInterval(() => {
      const currentTime = player.currentTime;
      const dur = player.duration;

      if (dur > 0) {
        setDuration(dur);
        setProgress((currentTime / dur) * 100);
        setWatchTime(currentTime);

        // Detectar fin del video
        if (currentTime >= dur - 0.1 && !hasReachedEnd) {
          setHasReachedEnd(true);
          setProgress(100);
          setIsPlaying(false);
          player.pause();
        }
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [currentAd?.id, player, hasReachedEnd]);

  const loadNextAd = () => {
    getNextAd(undefined, {
      onSuccess: (ad) => {
        if (ad) {
          setCurrentAd(ad);
          resetAdState();
        } else {
          setCurrentAd(null);
        }
      },
      onError: (error) => {
        console.error('Error cargando anuncio:', error);
      },
    });
  };

  const resetAdState = () => {
    setProgress(0);
    setWatchTime(0);
    setIsLiked(false);
    setShowReward(false);
    setHasReachedEnd(false);
    setIsPlaying(true);
    setIsExpanded(false);
    rewardOpacity.setValue(0);
  };

  // Manejo de reproducción para imágenes
  useEffect(() => {
    if (!currentAd || hasReachedEnd) return;

    const isImage = currentAd.mediaType === 'IMAGE';

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
          setHasReachedEnd(true);
          setProgress(100);
          setIsPlaying(false);
          return;
        }

        setWatchTime(elapsed);
        setProgress((elapsed / imageDuration) * 100);
      }, 1000 / 60);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentAd?.id, isPlaying, hasReachedEnd, watchTime]);

  const triggerReward = (amount: number) => {
    setRewardAmount(amount);
    setShowReward(true);
    Animated.sequence([
      Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(2600),
      Animated.timing(rewardOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowReward(false);
      setRewardAmount(null);
      loadNextAd();
    });
  };

  const togglePlayPause = () => {
    if (!currentAd || hasReachedEnd) return;

    const isImage = currentAd.mediaType === 'IMAGE';

    if (isImage) {
      setIsPlaying((prev) => !prev);
    } else {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  const handleLike = () => {
    if (!currentAd || isLikingAd || isLiked || !hasReachedEnd) return;

    likeAd(
      {
        adId: currentAd.id,
        sessionUUID: currentAd.sessionUUID,
      },
      {
        onSuccess: (res) => {
          setIsLiked(true);

          if (res.rewardAmount > 0) {
            triggerReward(res.rewardAmount);
          } else {
            setTimeout(() => {
              loadNextAd();
            }, 500);
          }
        },
        onError: (error) => {
          Alert.alert(
            'Error',
            'No se pudo registrar el like. Intenta nuevamente.'
          );
          console.error('Error al dar like:', error);
        },
      }
    );
  };

  const handleVisitAd = async () => {
    if (!currentAd?.targetUrl) return;

    const supported = await Linking.canOpenURL(currentAd.targetUrl);
    if (supported) {
      await Linking.openURL(currentAd.targetUrl);
    } else {
      Alert.alert('Error', 'No se puede abrir este enlace');
    }
  };

  const handleShare = async () => {
    if (!currentAd) return;

    try {
      await Share.share({
        title: currentAd.title ?? 'Anuncio',
        message: `${currentAd.title}\n\n${currentAd.description}\n\nMíralo aquí: ${currentAd.contentUrl}`,
        url: currentAd.contentUrl, // iOS usa esto
      });
    } catch (error) {
      console.error('Error compartiendo anuncio:', error);
    }
  };

  const handleSave = () => {
    if (!currentAd) return;
    console.log('Guardar:', currentAd);
  };

  useFocusEffect(
    useCallback(() => {
      if (currentAd && !hasReachedEnd) {
        setIsPlaying(true);
        if (currentAd.mediaType === 'VIDEO') {
          player.play();
        }
        // Para imágenes, el useEffect maneja el timer con isPlaying
      }

      return () => {
        if (currentAd && !hasReachedEnd) {
          setIsPlaying(false);
          if (currentAd.mediaType === 'VIDEO') {
            player.pause();
          }
          // Para imágenes, setting isPlaying a false detiene el timer
        }
      };
    }, [currentAd, hasReachedEnd, player])
  );

  if (isLoadingAd && !currentAd) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Cargando anuncio...</Text>
      </View>
    );
  }

  if (!currentAd) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No hay más anuncios disponibles</Text>
      </View>
    );
  }

  const isImage = currentAd.mediaType === 'IMAGE';

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Media Container - Centrado y completo */}
      <View style={styles.mediaWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={togglePlayPause}
          style={styles.mediaContainer}
          disabled={hasReachedEnd}
        >
          {isImage ? (
            <Image
              source={{ uri: currentAd.contentUrl }}
              style={styles.media}
              contentFit="contain"
              transition={300}
            />
          ) : (
            <VideoView
              player={player}
              style={styles.media}
              contentFit="contain"
              nativeControls={false}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Play overlay */}
      {!isPlaying && !hasReachedEnd && (
        <View style={styles.playOverlay}>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* End of ad overlay - Like prompt */}
      {hasReachedEnd && !isLiked && (
        <View style={styles.endOverlay}>
          <View style={styles.endCard}>
            <Text style={styles.endTitle}>¡Anuncio completado!</Text>
            <Text style={styles.endSubtitle}>Dale like para continuar</Text>
            <TouchableOpacity
              style={[styles.likeButton, isLikingAd && styles.likeButtonDisabled]}
              onPress={handleLike}
              disabled={isLikingAd}
              activeOpacity={0.8}
            >
              <Text style={styles.likeButtonText}>
                {isLikingAd ? 'Procesando...' : '❤️ Me gusta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Loading next ad overlay */}
      {isLiked && isLoadingAd && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingOverlayText}>
            Cargando siguiente anuncio...
          </Text>
        </View>
      )}

      {/* Media Info Overlay - Pegado al bottom con degradado */}
      <LinearGradient
        colors={isExpanded ? ['transparent', 'rgba(0,0,0,0.6)'] : ['transparent', 'rgba(0,0,0,0.3)']}
        style={[styles.infoOverlay, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.infoContent}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandInitial}>
                {currentAd.advertiserName?.[0]?.toUpperCase() ?? 'A'}
              </Text>
            </View>
            <Text style={styles.brandName}>{currentAd.advertiserName}</Text>
          </View>

          <Text style={styles.title}>{currentAd.title}</Text>
          <Text
            style={[styles.description, !isExpanded && styles.descriptionClamped]}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {currentAd.description}
          </Text>

          {currentAd.description && currentAd.description.length > 100 && (
            <TouchableOpacity onPress={() => setIsExpanded((v) => !v)}>
              <Text style={styles.expandButton}>
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Reward notification */}
      {showReward && rewardAmount !== null && (
        <Animated.View
          style={[styles.rewardContainer, 
          { opacity: rewardOpacity, pointerEvents: 'none' }]}
        >
          <View style={styles.rewardCard}>
            <View style={styles.rewardGlow} />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardEmoji}>🎉</Text>
              <View>
                <Text style={styles.rewardLabel}>Recompensa obtenida</Text>
                <Text style={styles.rewardAmount}>
                  +{rewardAmount}
                  <Text style={styles.rewardUnit}> puntos</Text>
                </Text>
                <Text style={styles.rewardThanks}>
                  Gracias por ver el anuncio
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <VideoControls
          onVisit={handleVisitAd}
          onShare={handleShare}
          onSave={handleSave}
          size="md"
        />
      </View>
    </View>
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
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
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
  mediaWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  endOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 20,
    paddingHorizontal: 16,
  },
  endCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  endTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  endSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  likeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#EC4899',
    borderRadius: 24,
  },
  likeButtonDisabled: {
    opacity: 0.5,
  },
  likeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 20,
  },
  loadingOverlayText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 20,
  },
  infoContent: {
    flexDirection: 'column',
    bottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  descriptionClamped: {
    marginBottom: 4,
  },
  expandButton: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '600',
    marginTop: 2,
  },
  rewardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  rewardCard: {
    position: 'relative',
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
  },
  rewardGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    backgroundColor: '#34D399',
    opacity: 0.3,
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rewardEmoji: {
    fontSize: 32,
  },
  rewardLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  rewardUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  rewardThanks: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  controlsContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -80 }],
    zIndex: 30,
  },
});