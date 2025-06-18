import { ZodError } from 'zod';

export const formatApiZodError = (error: ZodError) => {
  const mainError = error.errors[0];

  return {
    field: mainError.path.join('.'),
    message: mainError.message,
    error: mainError.code.replaceAll('_', ' '),
  };
};
