import { useQuery } from 'react-query';
import { SeasonSelectType } from '@/db/types';
import { apiClient } from '@/services';

const getCurrentSeason = async () => {
  const result = await apiClient.get<SeasonSelectType>('/season');
  return result.data;
};

export const useGetCurrentSeason = () => {
  return useQuery({
    queryKey: ['get-current-season'],
    queryFn: getCurrentSeason,
  });
};
