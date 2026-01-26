// apps/mobile/components/profile/LocationPicker.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Search } from 'lucide-react-native';
import { COLOMBIA_LOCATIONS } from '../../src/constants/locations';

interface LocationPickerProps {
  visible: boolean;
  currentDepartment: string;
  currentMunicipality: string;
  onSelect: (department: string, municipality: string) => void;
  onClose: () => void;
}

export default function LocationPicker({
  visible,
  currentDepartment,
  currentMunicipality,
  onSelect,
  onClose,
}: LocationPickerProps) {
  const [selectedDepartment, setSelectedDepartment] = useState(currentDepartment);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = Object.keys(COLOMBIA_LOCATIONS).filter((dept) =>
    dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMunicipalities = selectedDepartment
    ? COLOMBIA_LOCATIONS[selectedDepartment]?.filter((mun: any) =>
        mun.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : [];

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setSearchQuery('');
  };

  const handleMunicipalitySelect = (municipality: string) => {
    onSelect(selectedDepartment, municipality);
  };

  const handleBack = () => {
    if (selectedDepartment) {
      setSelectedDepartment('');
      setSearchQuery('');
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <X color="#007AFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedDepartment ? 'Seleccionar Municipio' : 'Seleccionar Departamento'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search color="#8E8E93" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedDepartment ? 'Buscar municipio...' : 'Buscar departamento...'}
            placeholderTextColor="#C7C7CC"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
          />
        </View>

        {/* List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {!selectedDepartment ? (
            // Departments list
            filteredDepartments.map((department) => (
              <TouchableOpacity
                key={department}
                style={styles.listItem}
                onPress={() => handleDepartmentSelect(department)}
                activeOpacity={0.7}
              >
                <Text style={styles.listItemText}>{department}</Text>
                {department === currentDepartment && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedText}>Actual</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            // Municipalities list
            filteredMunicipalities.map((municipality: any) => (
              <TouchableOpacity
                key={municipality}
                style={styles.listItem}
                onPress={() => handleMunicipalitySelect(municipality)}
                activeOpacity={0.7}
              >
                <Text style={styles.listItemText}>{municipality}</Text>
                {municipality === currentMunicipality &&
                  selectedDepartment === currentDepartment && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>Actual</Text>
                    </View>
                  )}
              </TouchableOpacity>
            ))
          )}

          {((!selectedDepartment && filteredDepartments.length === 0) ||
            (selectedDepartment && filteredMunicipalities.length === 0)) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No se encontraron resultados</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  listItemText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});