import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Contact } from '@/types/contacts';
import { useContacts } from '@/hooks/useContacts';
import { openDeviceSettings } from '@/utils/deviceSettings';
import { PermissionDeniedState } from './components/PermissionDeniedState';
import { ContactItem } from './components/ContactItem';
import { styles } from './ContactPicker.styles';

interface ContactPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

export const ContactPicker: React.FC<ContactPickerProps> = ({
  visible,
  onClose,
  onSelectContact,
}) => {
  const {
    contacts,
    isLoading,
    error,
    isAvailable,
    canAskAgain,
    fetchContacts,
    reset,
  } = useContacts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (visible && isAvailable) {
      const loadContacts = async (): Promise<void> => {
        await fetchContacts();
      };
      loadContacts();
    }
  }, [visible, isAvailable, fetchContacts]);

  useEffect(() => {
    if (error && error.includes('denegado')) {
      setPermissionDenied(true);
    } else {
      setPermissionDenied(false);
    }
  }, [error]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter(
        contact =>
          contact.name.toLowerCase().includes(query) ||
          contact.phoneNumber.includes(query),
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const handleClose = (): void => {
    setSearchQuery('');
    setPermissionDenied(false);
    reset();
    onClose();
  };

  const handleSelectContact = (contact: Contact): void => {
    onSelectContact(contact);
    handleClose();
  };

  const handleOpenSettings = async (): Promise<void> => {
    await openDeviceSettings();
  };

  const handleManualEntry = (): void => {
    handleClose();
  };

  const renderEmptyState = (): React.ReactElement => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.emptyText}>Cargando contactos...</Text>
        </View>
      );
    }

    if (permissionDenied) {
      return (
        <PermissionDeniedState
          canAskAgain={canAskAgain}
          onOpenSettings={handleOpenSettings}
          onManualEntry={handleManualEntry}
        />
      );
    }

    if (searchQuery && filteredContacts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron contactos</Text>
        </View>
      );
    }

    if (contacts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay contactos disponibles</Text>
        </View>
      );
    }

    return <></>;
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar contacto</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o teléfono"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactItem contact={item} onPress={handleSelectContact} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={true}
        />
      </SafeAreaView>
    </Modal>
  );
};
