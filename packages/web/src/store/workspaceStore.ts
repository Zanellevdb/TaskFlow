import { create } from 'zustand';
import {
  createWorkspace as createWorkspaceRequest,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace as updateWorkspaceRequest,
  deleteWorkspace as deleteWorkspaceRequest,
  type Workspace,
  type CreateWorkspaceRequest,
  type UpdateWorkspaceRequest,
} from '../api/workspace';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (data: CreateWorkspaceRequest) => Promise<Workspace>;
  updateWorkspace: (
    workspaceId: string,
    data: UpdateWorkspaceRequest
  ) => Promise<Workspace>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });

    try {
      const workspaces = await getWorkspaces();

      set({
        workspaces,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load workspaces',
      });

      throw error;
    }
  },

  fetchWorkspace: async (workspaceId) => {
    set({ isLoading: true, error: null });

    try {
      const workspace = await getWorkspaceById(workspaceId);

      set({
        currentWorkspace: workspace,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load workspace',
      });

      throw error;
    }
  },

  createWorkspace: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const workspace = await createWorkspaceRequest(data);

      set((state) => ({
        workspaces: [...state.workspaces, workspace],
        currentWorkspace: workspace,
        isLoading: false,
      }));

      return workspace;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to create workspace',
      });

      throw error;
    }
  },

  updateWorkspace: async (workspaceId, data) => {
    set({ isLoading: true, error: null });

    try {
      const workspace = await updateWorkspaceRequest(
        workspaceId,
        data
      );

      set((state) => ({
        workspaces: state.workspaces.map((item) =>
          item.id === workspace.id ? workspace : item
        ),
        currentWorkspace:
          state.currentWorkspace?.id === workspace.id
            ? workspace
            : state.currentWorkspace,
        isLoading: false,
      }));

      return workspace;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to update workspace',
      });

      throw error;
    }
  },

  deleteWorkspace: async (workspaceId) => {
    set({ isLoading: true, error: null });

    try {
      await deleteWorkspaceRequest(workspaceId);

      set((state) => ({
        workspaces: state.workspaces.filter(
          (workspace) => workspace.id !== workspaceId
        ),
        currentWorkspace:
          state.currentWorkspace?.id === workspaceId
            ? null
            : state.currentWorkspace,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to delete workspace',
      });

      throw error;
    }
  },

  setCurrentWorkspace: (workspace) => {
    set({
      currentWorkspace: workspace,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));