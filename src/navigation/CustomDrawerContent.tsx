import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView, DrawerContentComponentProps} from '@react-navigation/drawer';
import {LogOut, User} from 'lucide-react-native';
import {useAuthStore} from '@/store/authStore';
import {useLogout} from '@/features/auth/hooks/useLogout';
import {Theme} from '@/theme';
import {styles} from './CustomDrawerContent.styles';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const {user} = useAuthStore();
  const {logout} = useLogout();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color={Theme.colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
        {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <LogOut size={20} color={Theme.colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};
