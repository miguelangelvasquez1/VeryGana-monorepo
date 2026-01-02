import axios from 'axios';

export function createHttpClient(baseURL: string) {
  return axios.create({ baseURL });
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async config => {
  // aquí luego inyectas access token
  return config;
});
