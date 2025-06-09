import { NextRequest } from 'next/server';
import { db } from '@/drizzle';
import { logger } from '@/utils/logger';

export async function GET(req: NextRequest) {
  logger.info('Fetching all guilds');
  const guilds = await db.query.guilds.findMany();
  logger.debug({ guilds }, 'Fetched guilds');

  return Response.json(guilds);
}
