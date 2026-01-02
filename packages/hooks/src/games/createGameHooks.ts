import { useMutation, useQuery } from '@tanstack/react-query';
import type { GameService } from './types';
import { gameKeys } from './keys';

export function createGameHooks(gameService: GameService) {
  /**
   * Juegos disponibles (paginados)
   */
  function useAvailableGames(page = 0, size = 10) {
    return useQuery({
      queryKey: gameKeys.list(page, size),
      queryFn: () => gameService.getAvailableGamesPage(page, size),
      staleTime: 60_000,
    });
  }

  /**
   * Inicializar sesión de juego
   */
  function useInitGame() {
    return useMutation({
      mutationFn: gameService.initGame,
    });
  }

  /**
   * Enviar métricas del juego
   */
  function useSubmitGameMetrics() {
    return useMutation({
      mutationFn: gameService.submitGameMetrics,
    });
  }

  /**
   * Finalizar sesión
   */
  function useEndGameSession() {
    return useMutation({
      mutationFn: gameService.endSession,
    });
  }

  return {
    useAvailableGames,
    useInitGame,
    useSubmitGameMetrics,
    useEndGameSession,
  };
}
