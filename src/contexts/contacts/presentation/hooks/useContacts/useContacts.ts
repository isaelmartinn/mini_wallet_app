import { useState, useCallback } from 'react';
import { Contact } from '../../../domain/entities/Contact';
import { RequestContactsPermissionUseCase } from '../../../application/use-cases/RequestContactsPermissionUseCase';
import { GetContactsUseCase } from '../../../application/use-cases/GetContactsUseCase';

export interface UseContactsReturn {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
  canAskAgain: boolean;
  isAvailable: boolean;
  requestPermission: () => Promise<boolean>;
  fetchContacts: () => Promise<void>;
  reset: () => void;
}

/**
 * useContacts Hook
 * Manages contacts state and interactions with use cases.
 * Requires injected use cases for testability.
 */
export const useContacts = (
  requestPermissionUseCase: RequestContactsPermissionUseCase,
  getContactsUseCase: GetContactsUseCase,
  isAvailable: boolean,
): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) {
      setError('El módulo de contactos no está disponible');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await requestPermissionUseCase.execute();

      if (result.isOk()) {
        const status = result.value!;
        setPermissionGranted(status.granted);
        setCanAskAgain(status.canAskAgain);

        if (!status.granted) {
          setError('Permiso de contactos denegado');
        }

        return status.granted;
      } else {
        setError(result.error?.message || 'Error al solicitar permiso');
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al solicitar permiso';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, requestPermissionUseCase]);

  const fetchContacts = useCallback(async (): Promise<void> => {
    if (!isAvailable) {
      setError('El módulo de contactos no está disponible');
      return;
    }

    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getContactsUseCase.execute();

      if (result.isOk()) {
        setContacts(result.value || []);
      } else {
        setError(result.error?.message || 'Error al obtener contactos');
        setContacts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener contactos';
      setError(errorMessage);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, permissionGranted, requestPermission, getContactsUseCase]);

  const reset = useCallback((): void => {
    setContacts([]);
    setError(null);
    setIsLoading(false);
    setCanAskAgain(true);
  }, []);

  return {
    contacts,
    isLoading,
    error,
    permissionGranted,
    canAskAgain,
    isAvailable,
    requestPermission,
    fetchContacts,
    reset,
  };
};
