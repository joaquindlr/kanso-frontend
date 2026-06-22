import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { epicsService, type CreateEpicPayload } from '../services/epics.service';

export const useEpics = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['epics', projectId],
    queryFn: () => epicsService.getByProject(projectId!),
    enabled: !!projectId,
  });
};

export const useCreateEpic = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEpicPayload) => epicsService.create(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics', projectId] });
    },
  });
};
