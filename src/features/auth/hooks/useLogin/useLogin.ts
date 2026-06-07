import {useState, useCallback} from 'react';
import {useAuthStore} from '@/store/authStore';
import {validateIdentifier} from '@/utils/validation';

export const useLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const {login, isLoading, error: authError, clearError} = useAuthStore();

  const handleIdentifierChange = useCallback((text: string) => {
    setIdentifier(text);
    setValidationError(null);
    clearError();
  }, [clearError]);

  const handleLogin = useCallback(async () => {
    const validation = validateIdentifier(identifier);

    if (!validation.isValid) {
      setValidationError(validation.error || 'Error de validación');
      return;
    }

    setValidationError(null);
    await login({identifier});
  }, [identifier, login]);

  const error = validationError || authError;

  return {
    identifier,
    handleIdentifierChange,
    handleLogin,
    isLoading,
    error,
  };
};
