import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.bodySmall.fontSize,
    fontWeight: Theme.typography.bodySmall.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    minHeight: 48,
  },
  inputError: {
    borderColor: Theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: Theme.typography.body.fontSize,
    fontWeight: Theme.typography.body.fontWeight,
    color: Theme.colors.text,
    paddingVertical: Theme.spacing.sm,
  },
  inputWithLeftIcon: {
    marginLeft: Theme.spacing.sm,
  },
  leftIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: Theme.typography.caption.fontWeight,
    color: Theme.colors.error,
    marginTop: Theme.spacing.xs,
  },
  placeholder: {
    color: Theme.colors.textTertiary,
  },
});
