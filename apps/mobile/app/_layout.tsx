import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '../src/auth/AuthProvider';

export default function RootLayout() {
  // Importante: usar useState para evitar recrear el cliente en cada render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <Stack />
        </QueryClientProvider>
    </AuthProvider>
  );
}
