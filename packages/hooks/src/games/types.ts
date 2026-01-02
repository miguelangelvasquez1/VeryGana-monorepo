import type {
  EndSessionDTO,
  GameCardResponseDTO,
  GameEventDTO,
  GameMetricDTO,
  InitGameRequestDTO,
  InitGameResponseDTO,
} from '@verygana/types';

export type GameService = {
  initGame: (request: InitGameRequestDTO) => Promise<InitGameResponseDTO>;

  submitGameMetrics: (
    event: GameEventDTO<GameMetricDTO[]>
  ) => Promise<void>;

  endSession: (event: GameEventDTO<EndSessionDTO>) => Promise<void>;

  getAvailableGamesPage: (
    page?: number,
    size?: number
  ) => Promise<{
    content: GameCardResponseDTO[];
    totalElements: number;
    totalPages: number;
  }>;
};
