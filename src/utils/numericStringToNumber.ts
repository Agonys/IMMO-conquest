export const numericStringToNumber = (str: string): number => {
  const sanitized = str.replaceAll(',', '').trim();
  const value = Number(sanitized);
  if (Number.isNaN(value)) {
    throw new Error(`numericStringToNumber: "${str}" is not a valid numeric string`);
  }
  return value;
};
