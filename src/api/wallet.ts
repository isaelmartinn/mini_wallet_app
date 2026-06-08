import { Transaction } from '@/types';
import {
  MOCK_USERS,
  DEFAULT_BALANCE_IN_CENTS,
} from '@/utils/constants/constants';
import { centsToPesos } from '@/utils/currency/currency';

interface WalletDataResponse {
  success: boolean;
  balance: number;
  transactions: Transaction[];
  error?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 1250.5,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    description: 'Pago recibido de Juan Pérez',
    type: 'in',
    status: 'completed',
    recipient: 'Juan Pérez',
  },
  {
    id: '2',
    amount: 350.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    description: 'Transferencia a María González',
    type: 'out',
    status: 'completed',
    recipient: 'María González',
  },
  {
    id: '3',
    amount: 2500.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    description: 'Depósito mensual',
    type: 'in',
    status: 'completed',
  },
  {
    id: '4',
    amount: 89.99,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description: 'Compra en tienda online',
    type: 'out',
    status: 'completed',
    recipient: 'Amazon',
  },
  {
    id: '5',
    amount: 150.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    description: 'Pago de servicios',
    type: 'out',
    status: 'completed',
    recipient: 'CFE',
  },
  {
    id: '6',
    amount: 500.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    description: 'Transferencia recibida',
    type: 'in',
    status: 'completed',
    recipient: 'Carlos Ramírez',
  },
  {
    id: '7',
    amount: 75.5,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    description: 'Pago en restaurante',
    type: 'out',
    status: 'completed',
    recipient: 'La Parrilla',
  },
  {
    id: '8',
    amount: 1000.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    description: 'Reembolso',
    type: 'in',
    status: 'completed',
  },
  {
    id: '9',
    amount: 200.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    description: 'Transferencia a Ana López',
    type: 'out',
    status: 'pending',
    recipient: 'Ana López',
  },
  {
    id: '10',
    amount: 450.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    description: 'Pago recibido',
    type: 'in',
    status: 'completed',
    recipient: 'Pedro Sánchez',
  },
];

const simulateNetworkDelay = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 800 + Math.random() * 700);
  });
};

const shouldSimulateError = (): boolean => {
  return Math.random() < 0.1;
};

export const walletApi = {
  getWalletData: async (userId?: string): Promise<WalletDataResponse> => {
    await simulateNetworkDelay();

    if (shouldSimulateError()) {
      return {
        success: false,
        balance: 0,
        transactions: [],
        error: 'Error al cargar los datos de la wallet. Intenta de nuevo.',
      };
    }

    const mockUser = MOCK_USERS.find(user => user.id === userId);

    const balanceInCents = mockUser
      ? mockUser.balanceInCents
      : DEFAULT_BALANCE_IN_CENTS;

    const balanceInPesos = centsToPesos(balanceInCents);

    return {
      success: true,
      balance: balanceInPesos,
      transactions: MOCK_TRANSACTIONS,
    };
  },
};
