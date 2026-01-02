import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function PlayGameScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // 🔴 TEMPORAL: luego viene del backend
    const baseUrl = 'https://your-domain.com/dummy-game.html';

    setIframeUrl(`${baseUrl}?sessionToken=${token}`);
  }, [token]);

  if (!iframeUrl) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: iframeUrl }}
      style={styles.webview}
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
    backgroundColor: 'black',
  },
});
