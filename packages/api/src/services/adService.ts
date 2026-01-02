import type { AxiosInstance } from 'axios';
import type { AdForConsumerDTO, PagedResponse } from '@verygana/types';

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
  };
}
