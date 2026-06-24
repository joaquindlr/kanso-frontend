import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsService, type CreateProjectPayload } from '../services/projects.service';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsService.getAll,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProjectWhiteboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, excalidrawData }: { projectId: string; excalidrawData: any }) => 
      projectsService.updateWhiteboard(projectId, excalidrawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
