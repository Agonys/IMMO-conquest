import { apiClient } from '@/services';
import { GetGuildsResponse } from '@/types/guilds';
import { useQuery } from '@tanstack/react-query';

const getGuilds = async ({ season }: { season: number | null }) => {
  const searchParams = new URLSearchParams();
  if (season !== null && season !== undefined) {
    searchParams.set('season', season.toString());
  }
  const result = await apiClient.get<GetGuildsResponse>(`/guilds?${searchParams.toString()}`);
  return result.data;
};

export const useGetGuilds = ({ season }: { season: number | null }) => {
  return useQuery({
    queryKey: ['get-guilds', season],
    queryFn: () => getGuilds({ season }),
    enabled: season !== null,
  });
};
