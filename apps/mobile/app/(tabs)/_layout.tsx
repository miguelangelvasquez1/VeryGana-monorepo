// apps/mobile/app/(tabs)/_layout.tsx
import { Redirect, Tabs, useRouter } from 'expo-router';
import {
  Gamepad2,
  Gift,
  HomeIcon,
  Megaphone,
  ShoppingBag,
  Smartphone,
  User,
} from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../src/auth/useAuth';
import { useConsumerInitialData } from '../../src/hooks/consumerHooks';
import TopBar from '../../components/shared/TopBar';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        header: () => <TopBar 
                          onProfilePress={() => router.push('/profile')} 
                          onBalancePress={() => router.push('/profile')} />,
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 8,
          height: 70,
          borderTopColor: '#E5E5EA',
        },
      }}
    >
      <Tabs.Screen
        name="games"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color, size }) => (
            <Gamepad2 color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="raffles"
        options={{
          title: 'Rifas',
          tabBarIcon: ({ color, size }) => (
            <Gift color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="ads"
        options={{
          title: 'Anuncios',
          tabBarIcon: ({ color, size }) => (
            <Megaphone color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}