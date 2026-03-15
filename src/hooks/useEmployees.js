import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employeeApi';

export const EMPLOYEES_KEY = 'employees';

export function useGetEmployees(cafe = '') {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, cafe],
    queryFn: () => getEmployees(cafe),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}
