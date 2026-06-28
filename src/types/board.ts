export type IssueType = 'STORY' | 'BUG';
export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'ICEBOX' | 'NEW' | 'IN_PROGRESS' | 'DONE' | 'DEPLOYED' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  detail?: string;
  type: IssueType;
  severity: IssueSeverity;
  assignee?: User;
  epic?: { id: string; title: string; color?: string };
  subtasksTotal?: number;
  subtasksCompleted?: number;
  status: IssueStatus;
  position: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  issueId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}
