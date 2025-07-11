import { apiClient } from '@/services';
import { GetSeasonsResponse } from '@/types/seasons';
import { useQuery } from '@tanstack/react-query';

const getSeasons = async () => {
  const result = await apiClient.get<GetSeasonsResponse>('/seasons');
  return result.data;
};

export const useGetSeasons = () => {
  return useQuery({
    queryKey: ['get-seasons'],
    queryFn: getSeasons,
  });
};
