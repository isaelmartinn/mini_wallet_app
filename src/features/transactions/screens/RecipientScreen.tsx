import React, {useState} from 'react';
import {View, Text, SafeAreaView, KeyboardAvoidingView, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {validateRecipient} from '../utils';
import {Recipient} from '../types';
import {Button, Input} from '@/components';
import {styles} from './RecipientScreen.styles';

type RecipientScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const RecipientScreen: React.FC<RecipientScreenProps> = ({navigation}) => {
  const {setRecipient} = useTransactionFlowStore();
  const [name, setName] = useState('');
  const [accountOrPhone, setAccountOrPhone] = useState('');
  const [errors, setErrors] = useState<{name?: string; accountOrPhone?: string}>({});

  const handleContinue = (): void => {
    const recipient: Recipient = {
      name: name.trim(),
      accountOrPhone: accountOrPhone.trim(),
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
    const numericValue = text.replace(/\D/g, '');
    setAccountOrPhone(numericValue);
    if (errors.accountOrPhone) {
      setErrors(prev => ({...prev, accountOrPhone: undefined}));
    }
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                value={name}
                onChangeText={handleNameChange}
                placeholder="Ej: Juan Pérez"
                error={errors.name}
                autoCapitalize="words"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de teléfono</Text>
              <Input
                value={accountOrPhone}
                onChangeText={handleAccountChange}
                placeholder="10 dígitos"
                error={errors.accountOrPhone}
                keyboardType="number-pad"
                maxLength={10}
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
    </SafeAreaView>
  );
};
