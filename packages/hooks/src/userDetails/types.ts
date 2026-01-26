import type {
    BalanceResponseDTO,
  ConsumerInitialDataResponseDTO,
  ConsumerProfileResponseDTO,
} from '@verygana/types';

export type ConsumerService = {
  /**
   * Datos iniciales del consumidor al iniciar sesión
   */
  getInitialData(): Promise<ConsumerInitialDataResponseDTO>;

  /**
   * Perfil del consumidor autenticado
   */
  getProfile(): Promise<ConsumerProfileResponseDTO>;

  getBalance(): Promise<BalanceResponseDTO>;
};
