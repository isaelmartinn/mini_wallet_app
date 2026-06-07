import {StyleSheet} from 'react-native';
import {Theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xl,
  },
  loader: {
    marginTop: Theme.spacing.md,
  },
});
