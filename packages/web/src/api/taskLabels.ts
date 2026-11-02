import apiClient from './client';

export interface TaskLabel {
  id: string;
  name: string;
  color: string | null;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskLabelRequest {
  name: string;
  color?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTaskLabels = async (
  workspaceId: string,
  taskId: string
): Promise<TaskLabel[]> => {
  const response = await apiClient.get<
    ApiResponse<TaskLabel[]>
  >(`/task-labels/${workspaceId}/${taskId}`);

  return response.data.data;
};

export const createTaskLabel = async (
  workspaceId: string,
  taskId: string,
  data: CreateTaskLabelRequest
): Promise<TaskLabel> => {
  const response = await apiClient.post<
    ApiResponse<TaskLabel>
  >(
    `/task-labels/${workspaceId}/${taskId}`,
    data
  );

  return response.data.data;
};

export const deleteTaskLabel = async (
  workspaceId: string,
  taskId: string,
  labelId: string
): Promise<void> => {
  await apiClient.delete(
    `/task-labels/${workspaceId}/${taskId}/${labelId}`
  );
};