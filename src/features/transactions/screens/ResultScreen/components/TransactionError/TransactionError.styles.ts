import { StyleSheet } from 'react-native';
import { Theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  actions: {
    width: '100%',
    gap: Theme.spacing.md,
  },
});
