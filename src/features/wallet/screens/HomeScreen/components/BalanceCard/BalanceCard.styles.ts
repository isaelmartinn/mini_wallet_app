import { StyleSheet } from 'react-native';
import { Theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  header: {
    marginBottom: Theme.spacing.md,
  },
  greeting: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: Theme.typography.h4.fontWeight,
    color: Theme.colors.background,
    marginBottom: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.typography.bodySmall.fontSize,
    color: Theme.colors.primaryLight,
    opacity: 0.9,
  },
  balance: {
    fontSize: 40,
    fontWeight: '700',
    color: Theme.colors.background,
    letterSpacing: -1,
  },
  actions: {
    marginTop: Theme.spacing.lg,
  },
});
