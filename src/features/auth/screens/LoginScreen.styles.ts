import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontSize: Theme.typography.h1.fontSize,
    fontWeight: Theme.typography.h1.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: Theme.typography.body.fontWeight,
    color: Theme.colors.textSecondary,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  footer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    fontSize: Theme.typography.bodySmall.fontSize,
    fontWeight: Theme.typography.bodySmall.fontWeight,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  footerHint: {
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: Theme.typography.caption.fontWeight,
    color: Theme.colors.textTertiary,
  },
});
