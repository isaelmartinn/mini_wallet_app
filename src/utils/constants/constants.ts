import { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+525512345678',
    balanceInCents: 583501,
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+525587654321',
    balanceInCents: 1250000,
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+525555555555',
    balanceInCents: 750050,
  },
];

export const DEFAULT_BALANCE_IN_CENTS = 1000000;

export const MOCK_LOGIN_DELAY = 1500;
