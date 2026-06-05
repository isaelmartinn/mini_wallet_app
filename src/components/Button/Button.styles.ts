import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  primaryContainer: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.secondary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },

  smallContainer: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  mediumContainer: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  largeContainer: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
  },

  text: {
    fontSize: Theme.typography.button.fontSize,
    fontWeight: Theme.typography.button.fontWeight,
  },
  primaryText: {
    color: Theme.colors.background,
  },
  secondaryText: {
    color: Theme.colors.background,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  ghostText: {
    color: Theme.colors.primary,
  },

  smallText: {
    fontSize: Theme.typography.bodySmall.fontSize,
  },
  mediumText: {
    fontSize: Theme.typography.button.fontSize,
  },
  largeText: {
    fontSize: Theme.typography.h4.fontSize,
  },
});
