import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.h3,
    color: Theme.colors.error,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  message: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: 24,
  },
  buttonPrimary: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: Theme.colors.backgroundSecondary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...Theme.typography.button,
    color: Theme.colors.text,
  },
  buttonTextPrimary: {
    ...Theme.typography.button,
    color: Theme.colors.background,
  },
});
