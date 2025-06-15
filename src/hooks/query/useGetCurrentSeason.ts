import { useQuery } from 'react-query';
import { SeasonSelectType } from '@/db/types';
import { apiClient } from '@/services';

const getCurrentSeason = () => {
  return apiClient.get<unknown, SeasonSelectType>('/season');
};

export const useGetCurrentSeason = () => {
  return useQuery({
    queryKey: ['get-current-season'],
    queryFn: getCurrentSeason,
  });
};
