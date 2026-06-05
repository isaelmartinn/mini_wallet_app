import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '@/features/wallet/screens';
import {AppStackParamList} from './types';

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
