import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated
    ? <Redirect href="/home" />
    : <Redirect href="/login" />;
}