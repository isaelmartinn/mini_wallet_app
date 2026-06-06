import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '@/features/wallet/screens';
import {
  AmountScreen,
  RecipientScreen,
  SummaryScreen,
  ResultScreen,
} from '@/features/transactions/screens';
import {AppStackParamList} from './types';

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Amount"
        component={AmountScreen}
        options={{title: 'Enviar dinero'}}
      />
      <Stack.Screen
        name="Recipient"
        component={RecipientScreen}
        options={{title: 'Destinatario'}}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{title: 'Confirmar'}}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Resultado',
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};
