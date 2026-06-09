import { StyleSheet } from 'react-native';
import { Theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  headerTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    color: Theme.colors.text,
  },
  emptyList: {
    flexGrow: 1,
  },
});
