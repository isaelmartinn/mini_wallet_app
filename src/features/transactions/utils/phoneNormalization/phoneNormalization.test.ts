import { normalizePhoneNumber } from './phoneNormalization';

describe('normalizePhoneNumber', () => {
  it('should normalize Mexican international format (+52) with 12 digits', () => {
    const result = normalizePhoneNumber('+521234567890');
    expect(result).toBe('1234567890');
  });

  it('should normalize Mexican international format without + sign', () => {
    const result = normalizePhoneNumber('521234567890');
    expect(result).toBe('1234567890');
  });

  it('should keep 10-digit numbers unchanged', () => {
    const result = normalizePhoneNumber('1234567890');
    expect(result).toBe('1234567890');
  });

  it('should remove non-numeric characters', () => {
    const result = normalizePhoneNumber('123-456-7890');
    expect(result).toBe('1234567890');
  });

  it('should handle numbers with spaces', () => {
    const result = normalizePhoneNumber('123 456 7890');
    expect(result).toBe('1234567890');
  });

  it('should handle international format with parentheses', () => {
    const result = normalizePhoneNumber('+52 (123) 456-7890');
    expect(result).toBe('1234567890');
  });

  it('should not modify numbers that do not start with 52', () => {
    const result = normalizePhoneNumber('551234567890');
    expect(result).toBe('551234567890');
  });

  it('should not modify 52-prefixed numbers with incorrect length', () => {
    const result = normalizePhoneNumber('5212345678');
    expect(result).toBe('5212345678');
  });

  it('should handle empty string', () => {
    const result = normalizePhoneNumber('');
    expect(result).toBe('');
  });

  it('should handle string with only special characters', () => {
    const result = normalizePhoneNumber('+-()');
    expect(result).toBe('');
  });
});
