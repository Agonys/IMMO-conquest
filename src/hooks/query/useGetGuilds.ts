import { useQuery } from 'react-query';
import { GuildsListSelectType } from '@/db/types';
import { apiClient } from '@/services';

const getGuilds = ({ locationKey }: GuildsListSelectType) => {
  const searchParams = new URLSearchParams({
    locationKey: String(locationKey),
  });
  return apiClient.get<unknown>(`/guilds?${searchParams.toString()}`);
};

export const useGetGuilds = ({ locationKey }: Partial<GuildsListSelectType>) => {
  return useQuery({
    queryKey: ['get-guilds', location],
    queryFn: () => getGuilds({ locationKey } as GuildsListSelectType),
    enabled: !!(locationKey !== undefined),
  });
};
