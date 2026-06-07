import React, {useState} from 'react';
import {View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {validateRecipient, normalizePhoneNumber} from '@/features/transactions/utils';
import {Recipient} from '@/features/transactions/types';
import {Button, Input, ContactPicker} from '@/components';
import {Contact} from '@/types/contacts';
import {contactsService} from '@/services/ContactsService';
import {styles} from './RecipientScreen.styles';

type RecipientScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const RecipientScreen: React.FC<RecipientScreenProps> = ({navigation}) => {
  const {setRecipient} = useTransactionFlowStore();
  const [name, setName] = useState('');
  const [accountOrPhone, setAccountOrPhone] = useState('');
  const [errors, setErrors] = useState<{name?: string; accountOrPhone?: string}>({});
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [isFromContact, setIsFromContact] = useState(false);
  const isContactsAvailable = contactsService.isAvailable();

  const handleContinue = (): void => {
    const normalizedPhone = normalizePhoneNumber(accountOrPhone.trim());
    
    const recipient: Recipient = {
      name: name.trim(),
      accountOrPhone: normalizedPhone,
    };

    const validation = validateRecipient(recipient);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setRecipient(recipient);
    navigation.navigate('Summary');
  };

  const handleNameChange = (text: string): void => {
    setName(text);
    if (errors.name) {
      setErrors(prev => ({...prev, name: undefined}));
    }
  };

  const handleAccountChange = (text: string): void => {
    let processedValue = text;
    
    if (isFromContact && text.startsWith('+')) {
      processedValue = text;
    } else {
      processedValue = text.replace(/\D/g, '');
    }
    
    setAccountOrPhone(processedValue);
    
    if (!text.startsWith('+')) {
      setIsFromContact(false);
    }
    
    if (errors.accountOrPhone) {
      setErrors(prev => ({...prev, accountOrPhone: undefined}));
    }
  };

  const handleOpenContactPicker = (): void => {
    setShowContactPicker(true);
  };

  const handleCloseContactPicker = (): void => {
    setShowContactPicker(false);
  };

  const handleSelectContact = (contact: Contact): void => {
    setName(contact.name);
    setIsFromContact(true);
    setAccountOrPhone(contact.phoneNumber);
    setErrors({});
  };

  const isButtonDisabled = !name.trim() || !accountOrPhone.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>¿A quién le envías?</Text>
            <Text style={styles.subtitle}>Ingresa los datos del destinatario</Text>
          </View>

          <View style={styles.form}>
            {isContactsAvailable && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleOpenContactPicker}
                activeOpacity={0.7}>
                <Text style={styles.contactButtonText}>📱 Seleccionar de contactos</Text>
              </TouchableOpacity>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                value={name}
                onChangeText={handleNameChange}
                placeholder="Ej: Juan Pérez"
                error={errors.name}
                autoCapitalize="words"
                autoFocus={!isContactsAvailable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de teléfono</Text>
              <Input
                value={accountOrPhone}
                onChangeText={handleAccountChange}
                placeholder={isFromContact ? "Ej: +521234567890" : "10 dígitos"}
                error={errors.accountOrPhone}
                keyboardType={isFromContact ? "phone-pad" : "number-pad"}
                maxLength={isFromContact ? 13 : 10}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continuar"
            onPress={handleContinue}
            disabled={isButtonDisabled}
          />
        </View>
      </KeyboardAvoidingView>

      <ContactPicker
        visible={showContactPicker}
        onClose={handleCloseContactPicker}
        onSelectContact={handleSelectContact}
      />
    </SafeAreaView>
  );
};
