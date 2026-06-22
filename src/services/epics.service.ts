import { api } from './api';

export interface CreateEpicPayload {
  title: string;
  description?: string;
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  totalTasks?: number;
  completedTasks?: number;
  createdAt: string;
  updatedAt: string;
}

export const epicsService = {
  create: async (projectId: string, payload: CreateEpicPayload): Promise<Epic> => {
    const { data } = await api.post<Epic>(`/projects/${projectId}/epics`, payload);
    return data;
  },
  getByProject: async (projectId: string): Promise<Epic[]> => {
    const { data } = await api.get<Epic[]>(`/projects/${projectId}/epics`);
    return data;
  }
};
