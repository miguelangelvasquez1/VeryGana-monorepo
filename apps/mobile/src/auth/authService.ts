// src/auth/authService.ts
import axios from 'axios';
import { clearRefreshToken, saveRefreshToken } from './tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: 'ROLE_CONSUMER' | 'ROLE_ADVERTISER' | 'ROLE_SELLER' | 'ROLE_ADMIN';
}

export async function login(identifier: string, password: string) {
  const { data } = await axios.post<AuthResponse>(
    `${BASE_URL}/auth/login`,
    { identifier, password },
    {
      headers: {
        'X-Client-Type': 'mobile'
      }
    }
  );

  await saveRefreshToken(data.refreshToken);
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { data } = await axios.post<AuthResponse>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'X-Client-Type': 'mobile'
      }
    }
  );

  await saveRefreshToken(data.refreshToken);
  return data;
}

export async function logout(refreshToken: string) {
  await axios.post(`${BASE_URL}/auth/logout`,
    { refreshToken },
    {
      headers: {
        'X-Client-Type': 'mobile',
      },
    }
  );
}