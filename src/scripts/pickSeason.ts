import { SeasonInsertType } from '@/db/types';

const SEASON_LENGTH_DAYS = 60;

type SeasonInput = Omit<SeasonInsertType, 'id' | 'updatedAt' | 'createdAt' | 'deletedAt'> & {
  id?: SeasonInsertType['id'];
};

type SeasonDecision =
  | { type: 'ongoing'; season: SeasonInput }
  | { type: 'create'; newSeason: SeasonInput }
  | { type: 'error'; reason: string };

export const decideSeason = ({
  now,
  ongoingSeason,
  lastSeason,
  seasonLengthDays = SEASON_LENGTH_DAYS,
}: {
  now: string;
  ongoingSeason?: SeasonInput | null;
  lastSeason?: SeasonInput | null;
  seasonLengthDays?: number;
}): SeasonDecision => {
  if (ongoingSeason) {
    return { type: 'ongoing', season: ongoingSeason };
  }

  // If no last season, can't create a new one in the past
  if (!lastSeason) {
    return { type: 'error', reason: 'No seasons found and no ongoing season.' };
  }

  // New season starts at lastSeason.endDate
  const newSeasonStart = lastSeason.endDate;
  const startDate = new Date(newSeasonStart);
  const endDate = new Date(startDate.getTime() + seasonLengthDays * 24 * 60 * 60 * 1000);
  const newSeasonEnd = endDate.toISOString();

  // Check if "now" is within the new season
  if (now < newSeasonStart || now >= newSeasonEnd) {
    return {
      type: 'error',
      reason: 'No ongoing season and new season would not include now.',
    };
  }
  return {
    type: 'create',
    newSeason: {
      seasonNumber: lastSeason.seasonNumber,
      startDate: newSeasonStart,
      endDate: newSeasonEnd,
    },
  };
};
