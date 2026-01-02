// src/api/apiClient.ts
import axios from 'axios';
import { createHttpClient } from '@verygana/api';
import { getRefreshToken } from '../auth/tokenStorage';
import { refreshAccessToken } from '../auth/authService';
import { authRef } from '../auth/authRef';

export const apiClient = createHttpClient(
  process.env.EXPO_PUBLIC_API_URL!
);

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

apiClient.interceptors.request.use((config) => {
  const token = authRef.current?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  async error => {
    console.log("respponse");
    if (error.response?.status !== 401) throw error;

    if (isRefreshing) {
      return new Promise(resolve => {
        queue.push((token) => {
          error.config.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(error.config));
        });
      });
    }

    isRefreshing = true;

    try {
      const refresh = await getRefreshToken();
      if (!refresh) throw error;

      const res = await refreshAccessToken(refresh);
      authRef.current?.setAccessToken(res.accessToken);

      queue.forEach(cb => cb(res.accessToken));
      queue = [];

      error.config.headers.Authorization = `Bearer ${res.accessToken}`;
      return apiClient(error.config);
    } finally {
      isRefreshing = false;
    }
  }
);
