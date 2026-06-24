import { api } from './api';
import type { Comment } from '../types/board';

export const commentsService = {
  getCommentsByIssue: async (issueId: string): Promise<Comment[]> => {
    const { data } = await api.get<Comment[]>(`/issues/${issueId}/comments`);
    return data;
  },

  createComment: async (issueId: string, content: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/issues/${issueId}/comments`, { content });
    return data;
  },
};
