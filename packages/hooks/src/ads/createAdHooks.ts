// packages/hooks/src/createAdHooks.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AdService } from './types';
import type {
  AdForConsumerDTO,
  LikeAdResponse,
//   AdDetailsDTO,
//   AdStatsDTO,
  PagedResponse,
} from '@verygana/types';

/**
 * Factory that receives a platform-specific adService and returns hooks bound to it.
 * Keep this package free of any auth / platform logic.
 */
export function createAdHooks(adService: AdService) {
  
  function useActiveAds(page = 0, size = 10) {
    return useQuery({
      queryKey: ['ads', 'active', page, size],
      queryFn: () => adService.getActiveAds(page, size),
      staleTime: 60_000,
    });
  }

  /**
   * Obtiene el siguiente anuncio disponible
   * Usa mutation en lugar de query porque cada llamada consume el anuncio
   * y el backend decide cuál mostrar según algoritmo
   */
  function useNextAd() {
    return useMutation<AdForConsumerDTO | null>({
      mutationFn: () => adService.getNextAd(),
    });
  }

  /**
   * Registra un like en un anuncio
   * Retorna la recompensa obtenida por ver el anuncio
   */
  function useLikeAd() {
    return useMutation<
      LikeAdResponse,
      Error,
      { adId: number; sessionUUID: string }
    >({
      mutationFn: ({ adId, sessionUUID }) =>
        adService.likeAd(adId, sessionUUID),
    });
  }

  return { useActiveAds, useNextAd, useLikeAd, };
}