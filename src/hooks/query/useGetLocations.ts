import { useQuery } from 'react-query';
import { LocationSelectType } from '@/db/types';
import { apiClient } from '@/services';

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
