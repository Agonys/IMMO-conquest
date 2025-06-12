import { NextRequest } from 'next/server';
import { db } from '@/drizzle';
import { logger } from '@/utils/logger';
import { withErrorHandler } from '@/utils/withErrorHandler';

const getGuilds = async (req: NextRequest) => {
  // const params = new URLSearchParams(req.url);
  // console.log(params.get('location'));
  logger.info('Fetching all guilds');
  const guilds = await db.query.guilds.findMany();
  logger.debug({ guilds }, 'Fetched guilds');

  return Response.json(guilds);
};

export const GET = withErrorHandler(getGuilds);
