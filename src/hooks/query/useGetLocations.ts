import { useQuery } from 'react-query';
import { LocationSelectType } from '@/db/types';
import { apiClient } from '@/services';

const getLocations = () => {
  return apiClient.get<unknown, LocationSelectType[]>(`/locations`);
};

export const useGetLocations = () => {
  return useQuery({
    queryKey: ['get-locations'],
    queryFn: getLocations,
    select: (data) => {
      return data.map((item) => ({
        ...item,
        backgroundUrl: 'https://cdn.idle-mmo.com/cdn-cgi/image/width=400/uploaded/skins/' + item.backgroundUrl,
      }));
    },
  });
};
