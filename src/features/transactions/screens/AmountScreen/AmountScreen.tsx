import React, {useState} from 'react';
import {View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TextInput} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useWalletStore} from '@/store/walletStore';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {validateAmount} from '@/features/transactions/utils';
import {Button} from '@/components';
import {formatCurrency} from '@/utils/currency';
import {useInactivityTimeout} from '@/features/transactions/hooks/useInactivityTimeout';
import {TRANSACTION_TIMEOUT_MS} from '@/features/transactions/constants';
import {Theme} from '@/theme';
import {styles} from './AmountScreen.styles';

type AmountScreenProps = {
  navigation: StackNavigationProp<any>;
};

const formatInputAmount = (value: string): string => {
  if (!value) {
    return '';
  }
  
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
};

export const AmountScreen: React.FC<AmountScreenProps> = ({navigation}) => {
  const {balance} = useWalletStore();
  const {setAmount} = useTransactionFlowStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const {resetTimer} = useInactivityTimeout({
    timeoutMs: TRANSACTION_TIMEOUT_MS,
    onTimeout: () => {
      navigation.replace('Timeout');
    },
    enabled: true,
  });

  const handleAmountChange = (text: string): void => {
    resetTimer();
    
    let numericValue = text.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (parts[1] && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    if (numericValue.startsWith('0') && numericValue.length > 1 && numericValue[1] !== '.') {
      const withoutLeadingZeros = numericValue.replace(/^0+/, '');
      numericValue = withoutLeadingZeros || '0';
    }
    
    setInputValue(numericValue);
    setError(undefined);
  };

  const handleContinue = (): void => {
    resetTimer();
    
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
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              value={formatInputAmount(inputValue)}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              autoFocus
              style={styles.amountInput}
              placeholderTextColor={Theme.colors.textTertiary}
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
