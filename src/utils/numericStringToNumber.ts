export const numericStringToNumber = (str: string): number => {
  return +str.replaceAll(',', '');
};
