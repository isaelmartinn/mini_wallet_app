import {LoginCredentials, User} from '@/types';
import {validateIdentifier} from '@/utils/validation';
import {MOCK_USERS, MOCK_LOGIN_DELAY} from '@/utils/constants';

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const validation = validateIdentifier(credentials.identifier);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    await delay(MOCK_LOGIN_DELAY);

    const normalizedIdentifier = credentials.identifier.toLowerCase().trim();

    const user = MOCK_USERS.find(
      u =>
        u.email?.toLowerCase() === normalizedIdentifier ||
        u.phone?.replace(/\s/g, '') ===
          normalizedIdentifier.replace(/\s/g, ''),
    );

    if (user) {
      return {
        success: true,
        user,
      };
    }

    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name: 'Usuario Demo',
        email: credentials.identifier.includes('@')
          ? credentials.identifier
          : undefined,
        phone: !credentials.identifier.includes('@')
          ? credentials.identifier
          : undefined,
      },
    };
  },
};
