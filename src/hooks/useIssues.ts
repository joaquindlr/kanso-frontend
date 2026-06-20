import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesService } from '../services/issues.service';
import type { CreateStoryPayload, MoveIssuePayload } from '../services/issues.service';

export const useIssues = (projectId?: string) => {
  return useQuery({
    queryKey: ['issues', projectId],
    queryFn: () => issuesService.getIssuesByProject(projectId!),
    enabled: !!projectId,
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: CreateStoryPayload }) =>
      issuesService.createStory(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
    },
  });
};

export const useMoveIssue = () => {
  return useMutation({
    mutationFn: ({ issueId, payload }: { issueId: string; payload: MoveIssuePayload }) =>
      issuesService.moveIssue(issueId, payload),
  });
};
