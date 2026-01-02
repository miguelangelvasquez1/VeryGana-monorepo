// app/(auth)/login.tsx
import { View, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginScreen() {
  return (
    <>
      <View style={styles.container}>
        {/* Logo arriba a la izquierda */}
        <View style={styles.logoContainer}>
          <Link href="/">
            <Image
              source={require('@verygana/assets/logos/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Link>
        </View>

        {/* Formulario centrado */}
        <View style={styles.formContainer}>
          <LoginForm />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  logoContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
