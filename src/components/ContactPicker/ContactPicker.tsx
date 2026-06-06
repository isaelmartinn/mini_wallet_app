import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Contact} from '@/types/contacts';
import {useContacts} from '@/hooks/useContacts';
import {Button} from '@/components';
import {styles} from './ContactPicker.styles';

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
    fetchContacts,
    reset,
  } = useContacts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (visible && isAvailable) {
      fetchContacts();
    }
  }, [visible, isAvailable, fetchContacts]);

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
    reset();
    onClose();
  };

  const handleSelectContact = (contact: Contact): void => {
    onSelectContact(contact);
    handleClose();
  };

  const handleRetry = (): void => {
    fetchContacts();
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

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={handleRetry} />
        </View>
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

  const renderContactItem = ({item}: {item: Contact}): React.ReactElement => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleSelectContact(item)}
      activeOpacity={0.7}>
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!isAvailable) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}>
      <View style={styles.container}>
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
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </Modal>
  );
};
