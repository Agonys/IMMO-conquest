import { useQuery } from 'react-query';
import { apiClient } from '@/services';
import { GetGuildsResponse } from '@/types/guilds';

const getGuilds = async () => {
  const result = await apiClient.get<GetGuildsResponse>(`/guilds`);
  return result.data;
};

export const useGetGuilds = () => {
  return useQuery({
    queryKey: ['get-guilds'],
    queryFn: getGuilds,
  });
};
