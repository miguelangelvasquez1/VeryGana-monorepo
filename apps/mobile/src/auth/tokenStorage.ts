// src/auth/tokenStorage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_KEY = 'refreshToken';

export async function saveRefreshToken(token: string) {
  if (token == null) return;
  if (Platform.OS === 'web') {
    localStorage.setItem(REFRESH_KEY, token);
  } else {
    await SecureStore.setItemAsync(REFRESH_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  }
}

export async function getRefreshToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem(REFRESH_KEY);
  }
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearRefreshToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(REFRESH_KEY);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  }
}


// CUANDO NO SE USE WEB PARA PRUEBAS
// import * as SecureStore from 'expo-secure-store';

// const REFRESH_KEY = 'refreshToken';

// export async function saveRefreshToken(token: string) {
//   await SecureStore.setItemAsync(REFRESH_KEY, token, {
//     keychainAccessible: SecureStore.WHEN_UNLOCKED,
//   });
// }

// export async function getRefreshToken() {
//   return SecureStore.getItemAsync(REFRESH_KEY);
// }

// export async function clearRefreshToken() {
//   await SecureStore.deleteItemAsync(REFRESH_KEY);
// }
