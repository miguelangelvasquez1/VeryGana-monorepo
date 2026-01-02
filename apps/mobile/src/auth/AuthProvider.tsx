import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authRef } from './authRef';
import { AuthContextValue } from './AuthContext';

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      await logout();
      return null;
    }
  }

  async function logout() {
    setAccessToken(null);
    await SecureStore.deleteItemAsync('refreshToken');
  }

  const value: AuthContextValue = {
    accessToken,
    setAccessToken,
    refreshAccessToken,
    logout,
  };

  // 🔑 Aquí se expone a Axios/interceptors
  useEffect(() => {
    authRef.current = value;
    return () => {
      authRef.current = null;
    };
  }, [accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
