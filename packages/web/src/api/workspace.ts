import apiClient from './client';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  slug?: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createWorkspace = async (
  data: CreateWorkspaceRequest
): Promise<Workspace> => {
  const response = await apiClient.post<ApiResponse<Workspace>>(
    '/workspaces',
    data
  );

  return response.data.data;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await apiClient.get<ApiResponse<Workspace[]>>(
    '/workspaces'
  );

  return response.data.data;
};

export const getWorkspaceById = async (
  workspaceId: string
): Promise<Workspace> => {
  const response = await apiClient.get<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}`
  );

  return response.data.data;
};

export const updateWorkspace = async (
  workspaceId: string,
  data: UpdateWorkspaceRequest
): Promise<Workspace> => {
  const response = await apiClient.patch<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
    data
  );

  return response.data.data;
};

export const deleteWorkspace = async (
  workspaceId: string
): Promise<void> => {
  await apiClient.delete(`/workspaces/${workspaceId}`);
};