export interface Campaign {
  id: number;
  budget: number;
  status: string;
}

export * from './src/ads/adsTypes';
export * from './src/games/gamesTypes';
export * from './src/generic/responses';