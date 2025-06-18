import { ZodError } from 'zod';
import { formatApiZodError } from './formatApiZodError';

export const apiZodError = (error: ZodError): Response => {
  return new Response(JSON.stringify(formatApiZodError(error)), { status: 400 });
};
