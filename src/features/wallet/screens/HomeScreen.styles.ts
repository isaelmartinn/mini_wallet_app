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
    paddingTop: Theme.spacing.xxl,
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
    marginBottom: Theme.spacing.xl,
  },
  userInfo: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  infoText: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: Theme.typography.body.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
});
