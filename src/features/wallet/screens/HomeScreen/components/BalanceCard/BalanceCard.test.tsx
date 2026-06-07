import React from 'react';
import {render} from '@testing-library/react-native';
import {BalanceCard} from './BalanceCard';

describe('BalanceCard', () => {
  it('should render balance correctly', () => {
    const {getByText} = render(<BalanceCard balance={5000} />);

    expect(getByText('$5,000.00')).toBeTruthy();
  });

  it('should render user name when provided', () => {
    const {getByText} = render(<BalanceCard balance={5000} userName="Juan" />);

    expect(getByText('Hola, Juan')).toBeTruthy();
  });

  it('should render default user name when not provided', () => {
    const {getByText} = render(<BalanceCard balance={5000} />);

    expect(getByText('Hola, Usuario')).toBeTruthy();
  });

  it('should render label', () => {
    const {getByText} = render(<BalanceCard balance={5000} />);

    expect(getByText('Saldo disponible')).toBeTruthy();
  });

  it('should format zero balance correctly', () => {
    const {getByText} = render(<BalanceCard balance={0} />);

    expect(getByText('$0.00')).toBeTruthy();
  });

  it('should format large balance correctly', () => {
    const {getByText} = render(<BalanceCard balance={1234567.89} />);

    expect(getByText('$1,234,567.89')).toBeTruthy();
  });
});
