// apps/mobile/app/(tabs)/profile.tsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Mail, Phone, MapPin, Edit2, Check, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConsumerProfile } from '../src/hooks/consumerHooks';
import LocationPicker from '../components/profile/LocationPicker';
import { useAuth } from '../src/auth/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user, isLoading } = useConsumerProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const updateProfile = (updatedData: any, options?: any) => {
    setIsUpdating(true);
    (async () => {
      try {
        // TODO: replace with your real API call or mutation hook
        await Promise.resolve();
        setIsUpdating(false);
        options?.onSuccess?.();
      } catch (error) {
        setIsUpdating(false);
        options?.onError?.(error);
        console.error('Error in updateProfile placeholder:', error);
      }
    })();
  };
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setDepartment(user.department || '');
      setMunicipality(user.municipality || '');
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setDepartment(user.department);
      setMunicipality(user.municipality);
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!email.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'El email y teléfono son obligatorios');
      return;
    }

    updateProfile(
      {
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        department: department.trim(),
        municipality: municipality.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          Alert.alert('Éxito', 'Perfil actualizado correctamente');
        },
        onError: (error: any) => {
          Alert.alert('Error', 'No se pudo actualizar el perfil');
          console.error('Error updating profile:', error);
        },
      }
    );
  };

  const handleLocationSelect = (selectedDepartment: string, selectedMunicipality: string) => {
    setDepartment(selectedDepartment);
    setMunicipality(selectedMunicipality);
    setShowLocationPicker(false);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Edit2 color="#007AFF" size={20} />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <X color="#FF3B30" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#34C759" />
              ) : (
                <Check color="#34C759" size={20} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <User color="#FFFFFF" size={48} />
          </View>
          <Text style={styles.userName}>
            {user.name} {user.lastName}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
          <View style={[styles.stateBadge, getStateBadgeStyle(user.userState)]}>
            <Text style={styles.stateText}>{user.userState}</Text>
          </View>
        </View>

        {/* Información del perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLabel}>
              <Mail color="#8E8E93" size={20} />
              <Text style={styles.labelText}>Email</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#C7C7CC"
              />
            ) : (
              <Text style={styles.fieldValue}>{user.email}</Text>
            )}
          </View>

          {/* Teléfono */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLabel}>
              <Phone color="#8E8E93" size={20} />
              <Text style={styles.labelText}>Teléfono</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="+57 300 123 4567"
                placeholderTextColor="#C7C7CC"
              />
            ) : (
              <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
            )}
          </View>

          {/* Ubicación */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLabel}>
              <MapPin color="#8E8E93" size={20} />
              <Text style={styles.labelText}>Ubicación</Text>
            </View>
            {isEditing ? (
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => setShowLocationPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.locationButtonText}>
                  {department && municipality
                    ? `${municipality}, ${department}`
                    : 'Seleccionar ubicación'}
                </Text>
                <ChevronLeft
                  color="#007AFF"
                  size={20}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.fieldValue}>
                {user.municipality && user.department
                  ? `${user.municipality}, ${user.department}`
                  : 'No especificada'}
              </Text>
            )}
          </View>
        </View>

        {/* Información de solo lectura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>

          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyLabel}>ID de Usuario</Text>
            <Text style={styles.readOnlyValue}>#{user.id}</Text>
          </View>
        </View>

        {/* CAMBIO: Sección de logout al final */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          visible={showLocationPicker}
          currentDepartment={department}
          currentMunicipality={municipality}
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {/* CAMBIO: Modal de confirmación de logout */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Estás seguro?</Text>
            <Text style={styles.modalMessage}>¿Quieres cerrar sesión?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonTextConfirm}>Sí, cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStateBadgeStyle(state: string) {
  switch (state.toUpperCase()) {
    case 'ACTIVE':
    case 'ACTIVO':
      return { backgroundColor: '#D1FAE5', borderColor: '#34C759' };
    case 'INACTIVE':
    case 'INACTIVO':
      return { backgroundColor: '#FEE2E2', borderColor: '#FF3B30' };
    case 'SUSPENDED':
    case 'SUSPENDIDO':
      return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
    default:
      return { backgroundColor: '#F2F2F7', borderColor: '#8E8E93' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  editButton: {
    padding: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E5F1FF',
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  fieldValue: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 28,
  },
  input: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 28,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  readOnlyField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  readOnlyLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  readOnlyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  // CAMBIO: Estilos para botón de logout
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  // CAMBIO: Estilos para modal de logout
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButtonCancel: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalButtonConfirm: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});