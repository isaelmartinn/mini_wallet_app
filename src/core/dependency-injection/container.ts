import {
  AuthProvider,
  ContactsProvider,
  TransactionsProvider,
  WalletProvider,
} from './providers';

/**
 * Dependency Injection Container.
 * Provides a stable public API surface for presentation layer to consume.
 * Aggregates all context providers in one place.
 */
export const di = {
  auth: AuthProvider,
  contacts: ContactsProvider,
  transactions: TransactionsProvider,
  wallet: WalletProvider,
};

export type DIContainer = typeof di;
