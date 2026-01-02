// src/auth/authService.ts
import { apiClient } from "../api/apiClient";
import { saveRefreshToken } from './tokenStorage';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(identifier: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    identifier,
    password,
  });

  await saveRefreshToken(data.refreshToken);

  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/refresh',
    { refreshToken }
  );

  await saveRefreshToken(data.refreshToken);
  return data;
}
