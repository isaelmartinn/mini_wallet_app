import React, {useEffect} from 'react';
import {createDrawerNavigator, DrawerContentComponentProps} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '@/features/wallet/screens';
import {
  AmountScreen,
  RecipientScreen,
  SummaryScreen,
  ResultScreen,
} from '@/features/transactions/screens';
import {AppStackParamList} from './types';
import {CustomDrawerContent} from './CustomDrawerContent';
import {useWalletStore} from '@/store/walletStore';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<AppStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Amount"
        component={AmountScreen}
        options={{
          headerShown: true,
          title: 'Enviar dinero',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="Recipient"
        component={RecipientScreen}
        options={{
          headerShown: true,
          title: 'Destinatario',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          headerShown: true,
          title: 'Confirmar',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          headerShown: true,
          title: 'Resultado',
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export const AppStack: React.FC = () => {
  const fetchWalletData = useWalletStore(state => state.fetchWalletData);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}>
      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
    </Drawer.Navigator>
  );
};
