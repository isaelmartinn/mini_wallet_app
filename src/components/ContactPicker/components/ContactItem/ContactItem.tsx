import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Contact } from '@/types/contacts';
import { styles } from './ContactItem.styles';

interface ContactItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(contact)}
      activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};
