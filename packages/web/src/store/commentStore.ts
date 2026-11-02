import { create } from 'zustand';
import {
  createComment as createCommentRequest,
  getComments,
  deleteComment as deleteCommentRequest,
  type Comment,
  type CreateCommentRequest,
} from '../api/comments';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  fetchComments: (
    workspaceId: string,
    taskId: string
  ) => Promise<void>;

  createComment: (
    workspaceId: string,
    taskId: string,
    data: CreateCommentRequest
  ) => Promise<Comment>;

  deleteComment: (
    workspaceId: string,
    taskId: string,
    commentId: string
  ) => Promise<void>;

  clearComments: () => void;
  clearError: () => void;
}

export const useCommentStore = create<CommentState>(
  (set) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchComments: async (workspaceId, taskId) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const comments = await getComments(
          workspaceId,
          taskId
        );

        set({
          comments,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to load comments',
        });

        throw error;
      }
    },

    createComment: async (
      workspaceId,
      taskId,
      data
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const comment = await createCommentRequest(
          workspaceId,
          taskId,
          data
        );

        set((state) => ({
          comments: [...state.comments, comment],
          isLoading: false,
        }));

        return comment;
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to create comment',
        });

        throw error;
      }
    },

    deleteComment: async (
      workspaceId,
      taskId,
      commentId
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await deleteCommentRequest(
          workspaceId,
          taskId,
          commentId
        );

        set((state) => ({
          comments: state.comments.filter(
            (comment) => comment.id !== commentId
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to delete comment',
        });

        throw error;
      }
    },

    clearComments: () => {
      set({
        comments: [],
        error: null,
      });
    },

    clearError: () => {
      set({
        error: null,
      });
    },
  })
);