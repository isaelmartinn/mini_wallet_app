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
  text: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
});
