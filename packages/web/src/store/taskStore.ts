import { create } from 'zustand';
import {
  createTask as createTaskRequest,
  getTasks,
  getTaskById,
  updateTask as updateTaskRequest,
  deleteTask as deleteTaskRequest,
  type Task,
  type CreateTaskRequest,
  type UpdateTaskRequest,
} from '../api/task';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (workspaceId: string) => Promise<void>;
  fetchTask: (
    workspaceId: string,
    taskId: string
  ) => Promise<void>;
  createTask: (
    workspaceId: string,
    data: CreateTaskRequest
  ) => Promise<Task>;
  updateTask: (
    workspaceId: string,
    taskId: string,
    data: UpdateTaskRequest
  ) => Promise<Task>;
  deleteTask: (
    workspaceId: string,
    taskId: string
  ) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId) => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await getTasks(workspaceId);

      set({
        tasks,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load tasks',
      });

      throw error;
    }
  },

  fetchTask: async (workspaceId, taskId) => {
    set({ isLoading: true, error: null });

    try {
      const task = await getTaskById(
        workspaceId,
        taskId
      );

      set({
        currentTask: task,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load task',
      });

      throw error;
    }
  },

  createTask: async (workspaceId, data) => {
    set({ isLoading: true, error: null });

    try {
      const task = await createTaskRequest(
        workspaceId,
        data
      );

      set((state) => ({
        tasks: [...state.tasks, task],
        currentTask: task,
        isLoading: false,
      }));

      return task;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to create task',
      });

      throw error;
    }
  },

  updateTask: async (
    workspaceId,
    taskId,
    data
  ) => {
    set({ isLoading: true, error: null });

    try {
      const task = await updateTaskRequest(
        workspaceId,
        taskId,
        data
      );

      set((state) => ({
        tasks: state.tasks.map((item) =>
          item.id === task.id ? task : item
        ),
        currentTask:
          state.currentTask?.id === task.id
            ? task
            : state.currentTask,
        isLoading: false,
      }));

      return task;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to update task',
      });

      throw error;
    }
  },

  deleteTask: async (workspaceId, taskId) => {
    set({ isLoading: true, error: null });

    try {
      await deleteTaskRequest(
        workspaceId,
        taskId
      );

      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== taskId
        ),
        currentTask:
          state.currentTask?.id === taskId
            ? null
            : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to delete task',
      });

      throw error;
    }
  },

  setCurrentTask: (task) => {
    set({
      currentTask: task,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));