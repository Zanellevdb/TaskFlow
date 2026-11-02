import apiClient from './client';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateCommentRequest {
  content: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getComments = async (
  workspaceId: string,
  taskId: string
): Promise<Comment[]> => {
  const response = await apiClient.get<ApiResponse<Comment[]>>(
    `/comments/${workspaceId}/${taskId}`
  );

  return response.data.data;
};

export const createComment = async (
  workspaceId: string,
  taskId: string,
  data: CreateCommentRequest
): Promise<Comment> => {
  const response = await apiClient.post<ApiResponse<Comment>>(
    `/comments/${workspaceId}/${taskId}`,
    data
  );

  return response.data.data;
};

export const deleteComment = async (
  workspaceId: string,
  taskId: string,
  commentId: string
): Promise<void> => {
  await apiClient.delete(
    `/comments/${workspaceId}/${taskId}/${commentId}`
  );
};