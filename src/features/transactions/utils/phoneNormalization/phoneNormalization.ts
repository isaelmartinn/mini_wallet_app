export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('52') && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  
  return cleaned;
};
