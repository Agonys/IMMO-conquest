import { SeasonSelectType } from '@/db/types';

export interface GetSeasonsResponse {
  list: SeasonSelectType[];
  currentSeason?: SeasonSelectType;
}
