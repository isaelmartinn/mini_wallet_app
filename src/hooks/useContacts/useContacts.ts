import {useState, useCallback} from 'react';
import {Contact} from '@/types/contacts';
import {contactsService} from '@/services/ContactsService';

interface UseContactsReturn {
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

export const useContacts = (): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const isAvailable = contactsService.isAvailable();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) {
      setError('El módulo de contactos no está disponible');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await contactsService.requestPermission();
      setPermissionGranted(result.granted);
      setCanAskAgain(result.canAskAgain);
      
      if (!result.granted) {
        setError('Permiso de contactos denegado');
      }
      
      return result.granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al solicitar permiso';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

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
      
      const fetchedContacts = await contactsService.getContacts();
      setContacts(fetchedContacts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener contactos';
      setError(errorMessage);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, permissionGranted, requestPermission]);

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
