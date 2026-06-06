import React, {useState} from 'react';
import {View, Text, SafeAreaView, KeyboardAvoidingView, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useWalletStore} from '@/store/walletStore';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {validateAmount} from '../utils';
import {Button, Input} from '@/components';
import {styles} from './AmountScreen.styles';

type AmountScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const AmountScreen: React.FC<AmountScreenProps> = ({navigation}) => {
  const {balance} = useWalletStore();
  const {setAmount} = useTransactionFlowStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleAmountChange = (text: string): void => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setInputValue(numericValue);
    setError(undefined);
  };

  const handleContinue = (): void => {
    const amount = parseFloat(inputValue);

    if (isNaN(amount)) {
      setError('Ingresa un monto válido');
      return;
    }

    const validation = validateAmount(amount, balance);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setAmount(amount);
    navigation.navigate('Recipient');
  };

  const isButtonDisabled = !inputValue || parseFloat(inputValue) <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>¿Cuánto quieres enviar?</Text>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Input
              value={inputValue}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={error}
              autoFocus
              style={styles.amountInput}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
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
