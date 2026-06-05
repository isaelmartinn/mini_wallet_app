import React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@/components';
import {useAuthStore} from '@/store/authStore';
import {styles} from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const {user, logout} = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hola, {user?.name}!</Text>
        <Text style={styles.subtitle}>Bienvenido a tu wallet</Text>

        <View style={styles.userInfo}>
          {user?.email && (
            <Text style={styles.infoText}>Email: {user.email}</Text>
          )}
          {user?.phone && (
            <Text style={styles.infoText}>Teléfono: {user.phone}</Text>
          )}
        </View>

        <Button title="Cerrar Sesión" onPress={logout} variant="outline" />
      </View>
    </View>
  );
};
