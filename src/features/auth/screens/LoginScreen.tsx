import React from 'react';
import {View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import {Mail} from 'lucide-react-native';
import {Input, Button} from '@/components';
import {Theme} from '@/theme';
import {useLogin} from '../hooks/useLogin';
import {styles} from './LoginScreen.styles';

export const LoginScreen: React.FC = () => {
  const {identifier, handleIdentifierChange, handleLogin, isLoading, error} =
    useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            Ingresa tu email o teléfono para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email o Teléfono"
            placeholder="ejemplo@email.com o +523314530322"
            value={identifier}
            onChangeText={handleIdentifierChange}
            error={error || undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={20} color={Theme.colors.textSecondary} />}
            editable={!isLoading}
          />

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
