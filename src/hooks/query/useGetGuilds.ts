import { useQuery } from 'react-query';
import { apiClient } from '@/services/axios';

const getGuilds = (locationName = 'all') => {
  return apiClient.get(`/guilds?location=${locationName}`);
};

export const useGetGuilds = (locationName?: string) => {
  return useQuery({
    queryKey: ['get-guilds', locationName],
    queryFn: () => getGuilds(locationName),
  });
};
