import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {Button} from '@/components';
import {styles} from './SummaryScreen.styles';

type SummaryScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const SummaryScreen: React.FC<SummaryScreenProps> = ({navigation}) => {
  const {draft, processTransaction, isProcessing} = useTransactionFlowStore();

  const handleConfirm = async (): Promise<void> => {
    await processTransaction();
    navigation.navigate('Result');
  };

  const total = draft.amount + draft.fee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de transacción</Text>
          <Text style={styles.subtitle}>Revisa los detalles antes de confirmar</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destinatario</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{draft.recipient?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cuenta</Text>
              <Text style={styles.value}>{draft.recipient?.accountOrPhone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles del pago</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Monto</Text>
              <Text style={styles.value}>${draft.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Comisión</Text>
              <Text style={styles.value}>${draft.fee.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total a enviar</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isProcessing ? 'Procesando...' : 'Confirmar transacción'}
          onPress={handleConfirm}
          disabled={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
};
