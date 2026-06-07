import {validateIdentifier} from '../validation';

describe('validateIdentifier - Integration Tests', () => {
  describe('Email login scenarios', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co',
        'admin@company.mx',
        'contact+tag@email.com',
      ];

      validEmails.forEach(email => {
        const result = validateIdentifier(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'no-at-sign.com',
      ];

      invalidEmails.forEach(email => {
        const result = validateIdentifier(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('El formato del email no es válido');
      });
    });
  });

  describe('Phone login scenarios', () => {
    it('should accept valid Mexican phone numbers', () => {
      const validPhones = [
        '+523314530322',
        '+525512345678',
        '+521234567890',
        '+529876543210',
      ];

      validPhones.forEach(phone => {
        const result = validateIdentifier(phone);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject phones with more than 10 digits', () => {
      const invalidPhones = [
        '+52331453032299',
        '+5233145303229988',
        '+523314530322998877',
      ];

      invalidPhones.forEach(phone => {
        const result = validateIdentifier(phone);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('El teléfono debe tener 10 dígitos después de +52');
      });
    });

    it('should reject phones without +52 prefix', () => {
      const invalidPhones = [
        '3314530322',
        '5512345678',
        '1234567890',
      ];

      invalidPhones.forEach(phone => {
        const result = validateIdentifier(phone);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('El teléfono debe iniciar con +52');
      });
    });

    it('should reject phones with less than 10 digits', () => {
      const invalidPhones = [
        '+52331453032',
        '+5233145303',
        '+523314530',
      ];

      invalidPhones.forEach(phone => {
        const result = validateIdentifier(phone);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('El teléfono debe tener 10 dígitos después de +52');
      });
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle the reported bug cases correctly', () => {
      const bugCases = [
        {input: '+52331453032299', shouldBeValid: false},
        {input: '+5233145303229988', shouldBeValid: false},
        {input: '+523314530322998877', shouldBeValid: false},
        {input: '+523314530322', shouldBeValid: true},
      ];

      bugCases.forEach(({input, shouldBeValid}) => {
        const result = validateIdentifier(input);
        expect(result.isValid).toBe(shouldBeValid);
      });
    });

    it('should allow login with either email or phone', () => {
      const validEmail = validateIdentifier('user@example.com');
      expect(validEmail.isValid).toBe(true);

      const validPhone = validateIdentifier('+523314530322');
      expect(validPhone.isValid).toBe(true);
    });

    it('should detect input type correctly', () => {
      const emailInput = 'user@example.com';
      const phoneInput = '+523314530322';
      const numberInput = '3314530322';

      const emailResult = validateIdentifier(emailInput);
      expect(emailResult.isValid).toBe(true);

      const phoneResult = validateIdentifier(phoneInput);
      expect(phoneResult.isValid).toBe(true);

      const numberResult = validateIdentifier(numberInput);
      expect(numberResult.isValid).toBe(false);
      expect(numberResult.error).toBe('El teléfono debe iniciar con +52');
    });
  });
});
