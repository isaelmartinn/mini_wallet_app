import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  iconIncoming: {
    backgroundColor: Theme.colors.successLight,
  },
  iconOutgoing: {
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  description: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.textSecondary,
  },
  pendingBadge: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.warning,
    marginLeft: Theme.spacing.sm,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: '600',
  },
  amountIncoming: {
    color: Theme.colors.success,
  },
  amountOutgoing: {
    color: Theme.colors.text,
  },
});
