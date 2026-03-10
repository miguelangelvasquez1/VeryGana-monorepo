import { View, ActivityIndicator, StyleSheet, Text, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';

export default function PlayGameScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Al entrar → horizontal
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    return () => {
      // Al salir → volver a vertical
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };
  }, []);

  useEffect(() => {
    if (!url) return;
    setIframeUrl(url);
  }, [url]);

  const handleReload = () => {
    setError(null);
    setLoading(true);
  };

  if (!iframeUrl) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Pantalla de error controlada
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>No se pudo cargar el juego</Text>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.button} onPress={handleReload}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <WebView
        source={{ uri: iframeUrl }}
        style={styles.webview}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}

        onLoadStart={() => {
          setLoading(true);
          setError(null);
        }}

        onLoadEnd={() => setLoading(false)}

        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data?.type === "GAME_FINISHED") {
              console.log("Juego terminado. Victoria:", data.isVictory);

              // 👉 Aquí haces lo que necesites
              if (data.isVictory) {
                console.log("El usuario ganó");
              } else {
                console.log("El usuario perdió");
              }
            }

          } catch (err) {
            console.warn("Mensaje inválido del WebView");
          }
        }}

        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description || 'Error de conexión');
        }}

        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(`Error HTTP ${nativeEvent.statusCode}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
