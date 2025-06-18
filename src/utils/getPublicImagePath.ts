export const getPublicImagePath = (img?: string | null): string => {
  if (!img) return '';
  return `/uploaded/${img}`;
};
