import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function GameSearchBar() {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#9CA3AF" />
      <TextInput
        style={styles.input}
        placeholder="Buscar juegos"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
});