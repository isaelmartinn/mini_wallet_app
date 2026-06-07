import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xxl,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
  primaryButton: {
    marginBottom: Theme.spacing.md,
  },
});
