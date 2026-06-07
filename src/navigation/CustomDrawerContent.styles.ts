import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  userPhone: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.md,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.errorLight,
    gap: Theme.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.error,
  },
});
