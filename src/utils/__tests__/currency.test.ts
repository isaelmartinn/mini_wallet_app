import {formatCurrency} from '../currency';

describe('formatCurrency', () => {
  it('should format positive amounts correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative amounts correctly', () => {
    expect(formatCurrency(-500)).toBe('-$500.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should always show two decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(100.5)).toBe('$100.50');
    expect(formatCurrency(100.123)).toBe('$100.12');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(9999999.99)).toBe('$9,999,999.99');
  });
});
