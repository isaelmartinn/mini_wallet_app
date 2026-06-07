import {validateAmount, validateRecipient} from './validation';
import {TRANSACTION_ERRORS} from '../../constants';

describe('validateAmount', () => {
  it('should return valid for positive amount within balance', () => {
    const result = validateAmount(100, 500);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid for zero amount', () => {
    const result = validateAmount(0, 500);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.AMOUNT_ZERO);
  });

  it('should return invalid for negative amount', () => {
    const result = validateAmount(-50, 500);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.AMOUNT_ZERO);
  });

  it('should return invalid when amount exceeds balance', () => {
    const result = validateAmount(600, 500);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.AMOUNT_EXCEEDS_BALANCE);
  });

  it('should return valid when amount equals balance', () => {
    const result = validateAmount(500, 500);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('validateRecipient', () => {
  it('should return valid for complete recipient data', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return invalid for null recipient', () => {
    const result = validateRecipient(null);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe(TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED,
    );
  });

  it('should return invalid for empty name', () => {
    const recipient = {
      name: '',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe(TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED);
  });

  it('should return invalid for name with only spaces', () => {
    const recipient = {
      name: '   ',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe(TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED);
  });

  it('should return invalid for name shorter than 3 characters', () => {
    const recipient = {
      name: 'AB',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe(TRANSACTION_ERRORS.RECIPIENT_NAME_TOO_SHORT);
  });

  it('should return valid for name with exactly 3 characters', () => {
    const recipient = {
      name: 'ABC',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return invalid for empty account', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED,
    );
  });

  it('should return invalid for account with only spaces', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '   ',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED,
    );
  });

  it('should return invalid for both empty fields', () => {
    const recipient = {
      name: '',
      accountOrPhone: '',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe(TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED,
    );
  });

  it('should return invalid for phone number shorter than 10 digits', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '123456789',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_INVALID,
    );
  });

  it('should return invalid for phone number longer than 10 digits', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '12345678901',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(false);
    expect(result.errors.accountOrPhone).toBe(
      TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_INVALID,
    );
  });

  it('should return valid for exactly 10 digits', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '1234567890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should strip non-numeric characters and validate', () => {
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '123-456-7890',
    };
    const result = validateRecipient(recipient);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
