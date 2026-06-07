import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  balanceLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  balanceAmount: {
    ...Theme.typography.h3,
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
    alignSelf: 'center',
  },
  currencySymbol: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginRight: Theme.spacing.sm,
  },
  amountInput: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    textAlign: 'left',
    minWidth: 100,
    maxWidth: 250,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    marginTop: Theme.spacing.md,
    alignItems: 'center',
  },
  errorText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.error,
    textAlign: 'center',
  },
  footer: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
});
