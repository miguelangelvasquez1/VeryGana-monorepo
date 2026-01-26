// packages/hooks/src/types/adService.ts
import type { AdForConsumerDTO, LikeAdResponse } from '@verygana/types';

export type AdService = {
  getActiveAds(page?: number, size?: number): Promise<{
    content: AdForConsumerDTO[];
    totalElements: number;
    totalPages: number;
  }>;

  getNextAd(): Promise<AdForConsumerDTO | null>;

  likeAd(adId: number, sessionUUID: string): Promise<LikeAdResponse>;
};
