export type IssueType = 'STORY' | 'BUG';
export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'DEPLOYED';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description?: string;
  type: IssueType;
  severity: IssueSeverity;
  assignee?: User;
  subtasksTotal?: number;
  subtasksCompleted?: number;
  status: IssueStatus;
  position: string;
}
