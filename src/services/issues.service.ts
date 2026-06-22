import { api } from './api';
import type { Issue } from '../types/board';

export interface CreateStoryPayload {
  title: string;
  detail?: string;
  epicId?: string;
}

export interface MoveIssuePayload {
  status: string;
  position?: string;
}

export interface UpdateIssuePayload {
  title?: string;
  detail?: string;
  type?: 'STORY' | 'BUG';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: string;
  epicId?: string | null;
  assigneeId?: string | null;
}

export const issuesService = {
  getIssuesByProject: async (projectId: string): Promise<Issue[]> => {
    const { data } = await api.get<Issue[]>(`/projects/${projectId}/issues`);
    return data;
  },

  createStory: async (projectId: string, payload: CreateStoryPayload): Promise<Issue> => {
    const { data } = await api.post<Issue>(`/projects/${projectId}/stories`, payload);
    return data;
  },

  moveIssue: async (issueId: string, payload: MoveIssuePayload): Promise<Issue> => {
    const { data } = await api.patch<Issue>(`/issues/${issueId}/move`, payload);
    return data;
  },

  updateIssue: async (issueId: string, payload: UpdateIssuePayload): Promise<Issue> => {
    const { data } = await api.patch<Issue>(`/issues/${issueId}`, payload);
    return data;
  },
};
