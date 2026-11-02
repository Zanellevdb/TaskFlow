import apiClient from './client';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  slug?: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createProject = async (
  workspaceId: string,
  data: CreateProjectRequest
): Promise<Project> => {
  const response = await apiClient.post<ApiResponse<Project>>(
    `/projects/${workspaceId}`,
    data
  );

  return response.data.data;
};

export const getProjects = async (
  workspaceId: string
): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>(
    `/projects/${workspaceId}`
  );

  return response.data.data;
};

export const getProjectById = async (
  workspaceId: string,
  projectId: string
): Promise<Project> => {
  const response = await apiClient.get<ApiResponse<Project>>(
    `/projects/${workspaceId}/${projectId}`
  );

  return response.data.data;
};

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: UpdateProjectRequest
): Promise<Project> => {
  const response = await apiClient.patch<ApiResponse<Project>>(
    `/projects/${workspaceId}/${projectId}`,
    data
  );

  return response.data.data;
};

export const deleteProject = async (
  workspaceId: string,
  projectId: string
): Promise<void> => {
  await apiClient.delete(
    `/projects/${workspaceId}/${projectId}`
  );
};