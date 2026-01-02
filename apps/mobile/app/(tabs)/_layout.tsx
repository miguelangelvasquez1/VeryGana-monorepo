// apps/mobile/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import {
  Gamepad2,
  Gift,
  Megaphone,
  ShoppingBag,
  Smartphone,
  User,
} from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
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

      <Tabs.Screen
        name="topups"
        options={{
          title: 'Recargas',
          tabBarIcon: ({ color, size }) => (
            <Smartphone color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
