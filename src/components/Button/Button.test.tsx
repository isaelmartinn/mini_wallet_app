import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button, ButtonProps} from './Button';
import {Text} from 'react-native';

describe('Button', () => {
  const defaultProps: ButtonProps = {
    title: 'Test Button',
  };

  describe('Rendering', () => {
    it('should render with title', () => {
      const {getByText} = render(<Button {...defaultProps} />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with default variant (primary)', () => {
      const {getByText} = render(<Button {...defaultProps} />);
      const button = getByText('Test Button');
      expect(button).toBeTruthy();
    });

    it('should render with custom variant', () => {
      const {getByText} = render(
        <Button {...defaultProps} variant="secondary" />,
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with custom size', () => {
      const {getByText} = render(<Button {...defaultProps} size="large" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with left icon', () => {
      const leftIcon = <Text testID="left-icon">←</Text>;
      const {getByTestId} = render(
        <Button {...defaultProps} leftIcon={leftIcon} />,
      );
      expect(getByTestId('left-icon')).toBeTruthy();
    });

    it('should render with right icon', () => {
      const rightIcon = <Text testID="right-icon">→</Text>;
      const {getByTestId} = render(
        <Button {...defaultProps} rightIcon={rightIcon} />,
      );
      expect(getByTestId('right-icon')).toBeTruthy();
    });

    it('should render with both icons', () => {
      const leftIcon = <Text testID="left-icon">←</Text>;
      const rightIcon = <Text testID="right-icon">→</Text>;
      const {getByTestId} = render(
        <Button {...defaultProps} leftIcon={leftIcon} rightIcon={rightIcon} />,
      );
      expect(getByTestId('left-icon')).toBeTruthy();
      expect(getByTestId('right-icon')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show ActivityIndicator when loading', () => {
      const {getByTestId, queryByText} = render(
        <Button {...defaultProps} loading={true} testID="button" />,
      );
      expect(queryByText('Test Button')).toBeNull();
    });

    it('should not show title when loading', () => {
      const {queryByText} = render(<Button {...defaultProps} loading={true} />);
      expect(queryByText('Test Button')).toBeNull();
    });

    it('should not show icons when loading', () => {
      const leftIcon = <Text testID="left-icon">←</Text>;
      const rightIcon = <Text testID="right-icon">→</Text>;
      const {queryByTestId} = render(
        <Button
          {...defaultProps}
          loading={true}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        />,
      );
      expect(queryByTestId('left-icon')).toBeNull();
      expect(queryByTestId('right-icon')).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      const onPress = jest.fn();
      const {getByText} = render(
        <Button {...defaultProps} disabled={true} onPress={onPress} />,
      );
      const button = getByText('Test Button').parent?.parent;
      fireEvent.press(button!);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should be disabled when loading', () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button
          {...defaultProps}
          loading={true}
          onPress={onPress}
          testID="button"
        />,
      );
      const button = getByTestId('button');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const {getByText} = render(
        <Button {...defaultProps} onPress={onPress} />,
      );
      const button = getByText('Test Button').parent?.parent;
      fireEvent.press(button!);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const {getByText} = render(
        <Button {...defaultProps} disabled={true} onPress={onPress} />,
      );
      const button = getByText('Test Button').parent?.parent;
      fireEvent.press(button!);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button
          {...defaultProps}
          loading={true}
          onPress={onPress}
          testID="button"
        />,
      );
      const button = getByTestId('button');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      const {getByText} = render(<Button {...defaultProps} variant="primary" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const {getByText} = render(
        <Button {...defaultProps} variant="secondary" />,
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render outline variant', () => {
      const {getByText} = render(<Button {...defaultProps} variant="outline" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render ghost variant', () => {
      const {getByText} = render(<Button {...defaultProps} variant="ghost" />);
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const {getByText} = render(<Button {...defaultProps} size="small" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render medium size', () => {
      const {getByText} = render(<Button {...defaultProps} size="medium" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render large size', () => {
      const {getByText} = render(<Button {...defaultProps} size="large" />);
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Full Width', () => {
    it('should render with full width when fullWidth is true', () => {
      const {getByText} = render(<Button {...defaultProps} fullWidth={true} />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render without full width by default', () => {
      const {getByText} = render(<Button {...defaultProps} />);
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom style', () => {
      const customStyle = {backgroundColor: 'red'};
      const {getByText} = render(
        <Button {...defaultProps} style={customStyle} />,
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should accept testID prop', () => {
      const {getByTestId} = render(
        <Button {...defaultProps} testID="custom-button" />,
      );
      expect(getByTestId('custom-button')).toBeTruthy();
    });

    it('should accept accessibilityLabel prop', () => {
      const {getByLabelText} = render(
        <Button {...defaultProps} accessibilityLabel="Custom Label" />,
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });
  });
});
