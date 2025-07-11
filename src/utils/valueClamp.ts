export const valueClamp = (num: number, lower: number, upper: number): number => {
  return Math.min(Math.max(num, lower), upper);
};
