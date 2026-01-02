import { apiClient } from '../http';

export interface LoginResponse {
  accessToken: string;
  role: 'ROLE_CONSUMER' | 'ROLE_ADVERTISER' | 'ROLE_SELLER' | 'ROLE_ADMIN';
}

export const loginUser = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', {
    identifier,
    password,
  });
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const verifyToken = async (): Promise<boolean> => {
  await apiClient.get('/auth/verify');
  return true;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/password-reset/request', { email });
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await apiClient.post('/auth/password-reset/confirm', {
    token,
    newPassword,
  });
};
