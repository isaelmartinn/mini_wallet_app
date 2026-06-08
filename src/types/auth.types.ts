export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balanceInCents: number;
}

export interface LoginCredentials {
  identifier: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;
