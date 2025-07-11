import { LocationSelectType } from '@/db/types';
import { apiClient } from '@/services';
import { useQuery } from '@tanstack/react-query';

const getLocations = async () => {
  const result = await apiClient.get<LocationSelectType[]>(`/locations`);
  return result.data;
};

export const useGetLocations = () => {
  return useQuery({
    queryKey: ['get-locations'],
    queryFn: getLocations,
  });
};
