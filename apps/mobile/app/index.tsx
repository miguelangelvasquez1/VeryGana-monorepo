import { Text, View, Button } from 'react-native';
import { apiClient } from '@verygana/api';
import { router } from 'expo-router';

export default function HomeScreen() {
  const testApi = async () => {
    try {
      router.push("/(auth)/login");
      const res = await apiClient.get('/health');
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>VerYGana Mobile 🚀</Text>
      <Button title="Probar API" onPress={testApi} />
    </View>
  );
}