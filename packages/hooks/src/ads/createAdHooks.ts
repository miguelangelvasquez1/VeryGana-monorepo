// packages/hooks/src/createAdHooks.ts
import { useQuery } from '@tanstack/react-query';
import type {
  AdForConsumerDTO,
//   AdDetailsDTO,
//   AdStatsDTO,
  PagedResponse,
} from '@verygana/types';

export type AdService = {
  getActiveAds: (page?: number, size?: number) => Promise<{
    content: AdForConsumerDTO[];
    totalElements: number;
    totalPages: number;
  }>;
};

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

  return { useActiveAds };
}