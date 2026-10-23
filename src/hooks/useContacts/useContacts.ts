/**
 * useContacts Hook (Wrapper)
 * This is a temporary wrapper that bridges the old hook location to the new hexagonal context.
 * It uses the DI container to inject dependencies.
 *
 * This file will be removed in Phase 5 (cleanup phase) once all imports are redirected.
 */

import { di } from '@/core/dependency-injection';
import {
  useContacts as useContactsCore,
  UseContactsReturn,
} from '@/contexts/contacts/presentation/hooks/useContacts';

export const useContacts = (): UseContactsReturn => {
  return useContactsCore(
    di.contacts.requestPermissionUseCase,
    di.contacts.getContactsUseCase,
    di.contacts.isAvailable,
  );
};
