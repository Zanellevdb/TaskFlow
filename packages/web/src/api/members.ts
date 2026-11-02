import apiClient from './client';

export interface WorkspaceMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  const response = await apiClient.get<
    ApiResponse<WorkspaceMember[]>
  >(`/workspaces/${workspaceId}/members`);

  return response.data.data;
};