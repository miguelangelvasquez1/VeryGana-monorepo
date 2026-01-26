import type { AxiosInstance } from 'axios';
import type {
    BalanceResponseDTO,
  ConsumerInitialDataResponseDTO,
  ConsumerProfileResponseDTO,
  ConsumerUpdateProfileRequestDTO,
} from '@verygana/types';

export function createConsumerService(http: AxiosInstance) {
  return {

    /**
     * Obtiene el balance del consumidor autenticado
     */
    async getBalance(): Promise<BalanceResponseDTO> {
      const response = await http.get<BalanceResponseDTO>('/consumers/balance');
      return response.data;
    },

    /**
     * Obtener datos iniciales del consumidor
     */
    async getInitialData(): Promise<ConsumerInitialDataResponseDTO> {
      const response = await http.get<ConsumerInitialDataResponseDTO>(
        '/consumers/initialData'
      );
      return response.data;
    },

    /**
     * Obtener perfil del consumidor
     */
    async getProfile(): Promise<ConsumerProfileResponseDTO> {
      const response = await http.get<ConsumerProfileResponseDTO>(
        '/consumers/profile'
      );
      return response.data;
    },

    async updateProfile(profileData: Partial<ConsumerUpdateProfileRequestDTO>
    ): Promise<ConsumerUpdateProfileRequestDTO> {
      const response = await http.put<ConsumerUpdateProfileRequestDTO>(
        '/consumers/profile',
        profileData
      );
      return response.data;
    }
  };
}
