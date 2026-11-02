import { create } from 'zustand';
import {
  createTaskLabel as createTaskLabelRequest,
  getTaskLabels,
  deleteTaskLabel as deleteTaskLabelRequest,
  type TaskLabel,
  type CreateTaskLabelRequest,
} from '../api/taskLabels';

interface TaskLabelState {
  labels: TaskLabel[];
  isLoading: boolean;
  error: string | null;

  fetchLabels: (
    workspaceId: string,
    taskId: string
  ) => Promise<void>;

  createLabel: (
    workspaceId: string,
    taskId: string,
    data: CreateTaskLabelRequest
  ) => Promise<TaskLabel>;

  deleteLabel: (
    workspaceId: string,
    taskId: string,
    labelId: string
  ) => Promise<void>;

  clearLabels: () => void;
  clearError: () => void;
}

export const useTaskLabelStore = create<TaskLabelState>(
  (set) => ({
    labels: [],
    isLoading: false,
    error: null,

    fetchLabels: async (workspaceId, taskId) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const labels = await getTaskLabels(
          workspaceId,
          taskId
        );

        set({
          labels,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to load labels',
        });

        throw error;
      }
    },

    createLabel: async (
      workspaceId,
      taskId,
      data
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const label = await createTaskLabelRequest(
          workspaceId,
          taskId,
          data
        );

        set((state) => ({
          labels: [...state.labels, label],
          isLoading: false,
        }));

        return label;
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to create label',
        });

        throw error;
      }
    },

    deleteLabel: async (
      workspaceId,
      taskId,
      labelId
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await deleteTaskLabelRequest(
          workspaceId,
          taskId,
          labelId
        );

        set((state) => ({
          labels: state.labels.filter(
            (label) => label.id !== labelId
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to delete label',
        });

        throw error;
      }
    },

    clearLabels: () => {
      set({
        labels: [],
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