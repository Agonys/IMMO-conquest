import { useQuery } from 'react-query';
import { apiClient } from '@/services';

const getGuilds = () => {
  return apiClient.get<unknown>(`/guilds?location=${location}`);
};

export const useGetGuilds = () => {
  return useQuery({
    queryKey: ['get-guilds', location],
    queryFn: () => getGuilds(),
    enabled: false,
  });
};
