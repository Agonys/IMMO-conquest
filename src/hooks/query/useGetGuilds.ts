import { useQuery } from 'react-query';
import { apiClient } from '@/services';
import { GetGuildsResponse } from '@/types/guilds';

const getGuilds = () => {
  return apiClient.get<unknown, GetGuildsResponse>(`/guilds`);
};

export const useGetGuilds = () => {
  return useQuery({
    queryKey: ['get-guilds'],
    queryFn: getGuilds,
  });
};
