import type { AxiosInstance } from 'axios';
import type { AdForConsumerDTO, LikeAdResponse, PagedResponse } from '@verygana/types';

export function createAdService(http: AxiosInstance) {
    
  return {
    async getActiveAds(page = 0, size = 10): Promise<{
      content: AdForConsumerDTO[];
      totalElements: number;
      totalPages: number;
    }> {
      const response = await http.get<PagedResponse<AdForConsumerDTO>>(
        '/ads/user/available',
        { params: { page, size } }
      );

      return {
        content: response.data.data,
        totalElements: response.data.meta.totalElements,
        totalPages: response.data.meta.totalPages,
      };
    },
    /**
     * Obtiene el siguiente anuncio disponible
     * Retorna null si no hay más anuncios
     */
    async getNextAd(): Promise<AdForConsumerDTO | null> {
      try {
        const response = await http.get<AdForConsumerDTO>('/ads/next');
        return response.data;
      } catch (error: any) {
        // 204 No Content = no hay más anuncios disponibles
        if (error.response?.status === 204) {
          return null;
        }
        throw error;
      }
    },

    /**
     * Registra un like en un anuncio
     * Retorna información sobre la recompensa obtenida
     */
    async likeAd(
      adId: number,
      sessionUUID: string
    ): Promise<LikeAdResponse> {
      const response = await http.post<LikeAdResponse>('/adLike/like', {
        sessionUUID,
        adId,
      });
      return response.data;
    },
  };
}
