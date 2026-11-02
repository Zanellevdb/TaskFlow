import apiClient from './client';

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED';

export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export interface TaskProject {
  id: string;
  name: string;
  slug: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  workspaceId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  project: TaskProject;
  assignee: TaskAssignee | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createTask = async (
  workspaceId: string,
  data: CreateTaskRequest
): Promise<Task> => {
  const response = await apiClient.post<ApiResponse<Task>>(
    `/tasks/${workspaceId}`,
    data
  );

  return response.data.data;
};

export const getTasks = async (
  workspaceId: string
): Promise<Task[]> => {
  const response = await apiClient.get<ApiResponse<Task[]>>(
    `/tasks/${workspaceId}`
  );

  return response.data.data;
};

export const getTaskById = async (
  workspaceId: string,
  taskId: string
): Promise<Task> => {
  const response = await apiClient.get<ApiResponse<Task>>(
    `/tasks/${workspaceId}/${taskId}`
  );

  return response.data.data;
};

export const updateTask = async (
  workspaceId: string,
  taskId: string,
  data: UpdateTaskRequest
): Promise<Task> => {
  const response = await apiClient.patch<ApiResponse<Task>>(
    `/tasks/${workspaceId}/${taskId}`,
    data
  );

  return response.data.data;
};

export const deleteTask = async (
  workspaceId: string,
  taskId: string
): Promise<void> => {
  await apiClient.delete(
    `/tasks/${workspaceId}/${taskId}`
  );
};