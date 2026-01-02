// apps/mobile/src/hooks/gameHooks.ts
import { createGameHooks } from '@verygana/hooks';
import { gameService } from '../services/gameService';

export const {
  useAvailableGames,
  useInitGame,
  useSubmitGameMetrics,
  useEndGameSession,
} = createGameHooks(gameService);
