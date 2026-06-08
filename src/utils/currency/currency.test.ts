import { formatCurrency, centsToPesos, pesosToCents } from './currency';

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

describe('centsToPesos', () => {
  it('should convert cents to pesos correctly', () => {
    expect(centsToPesos(583501)).toBe(5835.01);
    expect(centsToPesos(1000000)).toBe(10000);
    expect(centsToPesos(0)).toBe(0);
  });

  it('should handle large amounts', () => {
    expect(centsToPesos(1250000)).toBe(12500);
    expect(centsToPesos(750050)).toBe(7500.5);
  });
});

describe('pesosToCents', () => {
  it('should convert pesos to cents correctly', () => {
    expect(pesosToCents(5835.01)).toBe(583501);
    expect(pesosToCents(10000)).toBe(1000000);
    expect(pesosToCents(0)).toBe(0);
  });

  it('should round to nearest cent', () => {
    expect(pesosToCents(10.005)).toBe(1001);
    expect(pesosToCents(10.004)).toBe(1000);
  });

  it('should handle large amounts', () => {
    expect(pesosToCents(12500)).toBe(1250000);
    expect(pesosToCents(7500.5)).toBe(750050);
  });
});
