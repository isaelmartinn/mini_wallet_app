import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Clock} from 'lucide-react-native';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {Button} from '@/components';
import {Theme} from '@/theme';
import {styles} from './TimeoutScreen.styles';

interface TimeoutScreenProps {
  navigation: StackNavigationProp<Record<string, object | undefined>>;
}

export const TimeoutScreen: React.FC<TimeoutScreenProps> = ({navigation}) => {
  const {reset} = useTransactionFlowStore();

  const handleTryAgain = (): void => {
    reset();
    navigation.replace('Amount');
  };

  const handleGoHome = (): void => {
    reset();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Clock size={80} color={Theme.colors.error} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Tiempo agotado</Text>

        <Text style={styles.description}>
          La sesión ha expirado por inactividad. Por favor, intenta nuevamente.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Intentar de nuevo"
          onPress={handleTryAgain}
          style={styles.primaryButton}
        />
        <Button
          title="Volver al inicio"
          onPress={handleGoHome}
          variant="secondary"
        />
      </View>
    </SafeAreaView>
  );
};
