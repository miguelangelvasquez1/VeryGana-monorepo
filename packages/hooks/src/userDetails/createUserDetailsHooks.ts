import { useQuery } from '@tanstack/react-query';
import type { ConsumerService } from './types';
import { consumerKeys } from './keys';

/**
 * Factory that receives a platform-specific consumerService and returns hooks bound to it.
 * Keep this package free of any auth / platform logic.
 */
export function createConsumerHooks(consumerService: ConsumerService) {

  /**
   * Obtiene el balance del usuario autenticado
   */
  function useUserBalance() {
    return useQuery({
      queryKey: consumerKeys.balance(),
      queryFn: () => consumerService.getBalance(),
      staleTime: 30_000,
    });
  }

  /**
   * Obtiene los datos iniciales del consumidor
   */
  function useConsumerInitialData() {
    return useQuery({
      queryKey: consumerKeys.initialData(),
      queryFn: () => consumerService.getInitialData(),
      staleTime: 5 * 60_000, // 5 minutos
    });
  }

  /**
   * Obtiene el perfil del consumidor
   */
  function useConsumerProfile() {
    return useQuery({
      queryKey: consumerKeys.profile(),
      queryFn: () => consumerService.getProfile(),
      staleTime: 60_000,
    });
  }

  return {
    useConsumerInitialData,
    useConsumerProfile,
    useUserBalance,
  };
}
