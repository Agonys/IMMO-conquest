import pino, { Logger } from 'pino';

export const logger: Logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
