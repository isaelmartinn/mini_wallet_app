import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  title: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
  },
  closeButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  closeButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.primary,
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  searchInput: {
    ...Theme.typography.body,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    color: Theme.colors.text,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  errorText: {
    ...Theme.typography.body,
    color: Theme.colors.error,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
});
