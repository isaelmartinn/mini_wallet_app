import {AmountValidation, RecipientValidation, Recipient} from '../../types';
import {TRANSACTION_RULES, TRANSACTION_ERRORS} from '../../constants';

export const validateAmount = (
  amount: number,
  currentBalance: number,
): AmountValidation => {
  if (amount <= 0) {
    return {
      isValid: false,
      error: TRANSACTION_ERRORS.AMOUNT_ZERO,
    };
  }

  if (amount > currentBalance) {
    return {
      isValid: false,
      error: TRANSACTION_ERRORS.AMOUNT_EXCEEDS_BALANCE,
    };
  }

  return {isValid: true};
};

export const validateRecipient = (
  recipient: Recipient | null,
): RecipientValidation => {
  const errors: RecipientValidation['errors'] = {};

  if (!recipient) {
    return {
      isValid: false,
      errors: {
        name: TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED,
        accountOrPhone: TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED,
      },
    };
  }

  if (!recipient.name || recipient.name.trim().length === 0) {
    errors.name = TRANSACTION_ERRORS.RECIPIENT_NAME_REQUIRED;
  } else if (
    recipient.name.trim().length < TRANSACTION_RULES.MIN_RECIPIENT_NAME_LENGTH
  ) {
    errors.name = TRANSACTION_ERRORS.RECIPIENT_NAME_TOO_SHORT;
  }

  if (!recipient.accountOrPhone || recipient.accountOrPhone.trim().length === 0) {
    errors.accountOrPhone = TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_REQUIRED;
  } else {
    const phoneNumber = recipient.accountOrPhone.trim().replace(/\D/g, '');
    if (phoneNumber.length !== TRANSACTION_RULES.MIN_ACCOUNT_LENGTH) {
      errors.accountOrPhone = TRANSACTION_ERRORS.RECIPIENT_ACCOUNT_INVALID;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
