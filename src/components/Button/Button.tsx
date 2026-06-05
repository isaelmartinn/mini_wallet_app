import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {styles} from './Button.styles';
import {Theme} from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.container,
    styles[`${variant}Container` as keyof typeof styles] as ViewStyle,
    styles[`${size}Container` as keyof typeof styles] as ViewStyle,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ].filter(Boolean) as TextStyle[];

  const getSpinnerColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return Theme.colors.primary;
    }
    return Theme.colors.background;
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyles}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};
