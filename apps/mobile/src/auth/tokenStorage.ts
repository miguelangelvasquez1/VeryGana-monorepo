// src/auth/tokenStorage.ts
import * as SecureStore from 'expo-secure-store';

const REFRESH_KEY = 'vg_refresh_token';

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
