import type { AxiosInstance } from 'axios';
import type {
  EndSessionDTO,
  GameCardResponseDTO,
  GameEventDTO,
  GameMetricDTO,
  InitGameRequestDTO,
  InitGameResponseDTO,
} from '@verygana/types';
import type { PagedResponse } from '@verygana/types';

export function createGameService(http: AxiosInstance) {
  return {
    /**
     * Inicializa una sesión de juego
     */
    async initGame(
      request: InitGameRequestDTO
    ): Promise<InitGameResponseDTO> {
      const response = await http.post<InitGameResponseDTO>(
        '/games/init',
        request
      );
      return response.data;
    },

    /**
     * Envía métricas del juego
     */
    async submitGameMetrics(
      event: GameEventDTO<GameMetricDTO[]>
    ): Promise<void> {
      await http.post('/games/metrics', event);
    },

    /**
     * Finaliza una sesión de juego
     */
    async endSession(
      event: GameEventDTO<EndSessionDTO>
    ): Promise<void> {
      await http.post('/games/end-session', event);
    },

    /**
     * Obtiene juegos disponibles paginados
     */
    async getAvailableGamesPage(
      page = 0,
      size = 10
    ): Promise<{
      content: GameCardResponseDTO[];
      totalElements: number;
      totalPages: number;
    }> {
      const response = await http.get<PagedResponse<GameCardResponseDTO>>(
        '/games',
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
