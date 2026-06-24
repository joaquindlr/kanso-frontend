import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '../services/comments.service';

export const useComments = (issueId?: string) => {
  return useQuery({
    queryKey: ['comments', issueId],
    queryFn: () => commentsService.getCommentsByIssue(issueId!),
    enabled: !!issueId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, content }: { issueId: string; content: string }) =>
      commentsService.createComment(issueId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.issueId] });
    },
  });
};
