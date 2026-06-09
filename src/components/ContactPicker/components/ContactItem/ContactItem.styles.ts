import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/Theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
    backgroundColor: Theme.colors.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  avatarText: {
    ...Theme.typography.h4,
    color: Theme.colors.background,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  phone: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
});
