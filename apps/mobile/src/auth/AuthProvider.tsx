import React, { createContext, useContext, useEffect, useState } from 'react';
import { authRef } from './authRef';
import { AuthContextValue } from './AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { clearRefreshToken, getRefreshToken } from './tokenStorage';
import { refreshAccessToken } from './authService';
import { logout as logoutService } from './authService';

SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  async function logout() {
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await logoutService(refreshToken);
      }
    } catch (error) {
      console.warn('Logout backend failed, cleaning local state anyway', error);
    } finally {
      setAccessToken(null);
      await clearRefreshToken();
    }
  }

  // Refrescar el token al iniciar la app
  useEffect(() => {
    (async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          console.log("Refresh token encontrado, iniciando refresco...");
          const res = await refreshAccessToken(refreshToken);
          setAccessToken(res.accessToken);
        }
      } catch {
        await logout();
      } finally {
        setIsBootstrapping(false);
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
  }, []);

  const value: AuthContextValue = {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading: isBootstrapping,
    setAccessToken,
    logout,
  };

  // Aquí se expone a Axios/interceptors
  useEffect(() => {
    authRef.current = value;
    return () => {
      authRef.current = null;
    };
  }, [accessToken, isBootstrapping]);

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};


function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/loteria-quindio.png')} />
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
