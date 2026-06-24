import { api } from './api';
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw";

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  totalTasks?: number;
  completedTasks?: number;
  excalidrawData?: ExcalidrawInitialDataState;
  createdAt: string;
  updatedAt: string;
}

export const projectsService = {
  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
  },
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },
  updateWhiteboard: async (projectId: string, excalidrawData: ExcalidrawInitialDataState): Promise<void> => {
    await api.patch(`/projects/${projectId}/whiteboard`, { excalidrawData });
  }
};
