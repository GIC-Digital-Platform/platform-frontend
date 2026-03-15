import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCafes, createCafe, updateCafe, deleteCafe } from '../api/cafeApi';

export const CAFES_KEY = 'cafes';

export function useGetCafes(location = '') {
  return useQuery({
    queryKey: [CAFES_KEY, location],
    queryFn: () => getCafes(location),
  });
}

export function useCreateCafe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCafe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CAFES_KEY] }),
  });
}

export function useUpdateCafe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCafe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CAFES_KEY] }),
  });
}

export function useDeleteCafe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CAFES_KEY] }),
  });
}
