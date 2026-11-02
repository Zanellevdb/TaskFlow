import { create } from 'zustand';
import {
  createProject as createProjectRequest,
  getProjects,
  getProjectById,
  updateProject as updateProjectRequest,
  deleteProject as deleteProjectRequest,
  type Project,
  type CreateProjectRequest,
  type UpdateProjectRequest,
} from '../api/project';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: (workspaceId: string) => Promise<void>;
  fetchProject: (
    workspaceId: string,
    projectId: string
  ) => Promise<void>;
  createProject: (
    workspaceId: string,
    data: CreateProjectRequest
  ) => Promise<Project>;
  updateProject: (
    workspaceId: string,
    projectId: string,
    data: UpdateProjectRequest
  ) => Promise<Project>;
  deleteProject: (
    workspaceId: string,
    projectId: string
  ) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (workspaceId) => {
    set({ isLoading: true, error: null });

    try {
      const projects = await getProjects(workspaceId);

      set({
        projects,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load projects',
      });

      throw error;
    }
  },

  fetchProject: async (workspaceId, projectId) => {
    set({ isLoading: true, error: null });

    try {
      const project = await getProjectById(
        workspaceId,
        projectId
      );

      set({
        currentProject: project,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load project',
      });

      throw error;
    }
  },

  createProject: async (workspaceId, data) => {
    set({ isLoading: true, error: null });

    try {
      const project = await createProjectRequest(
        workspaceId,
        data
      );

      set((state) => ({
        projects: [...state.projects, project],
        currentProject: project,
        isLoading: false,
      }));

      return project;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to create project',
      });

      throw error;
    }
  },

  updateProject: async (
    workspaceId,
    projectId,
    data
  ) => {
    set({ isLoading: true, error: null });

    try {
      const project = await updateProjectRequest(
        workspaceId,
        projectId,
        data
      );

      set((state) => ({
        projects: state.projects.map((item) =>
          item.id === project.id ? project : item
        ),
        currentProject:
          state.currentProject?.id === project.id
            ? project
            : state.currentProject,
        isLoading: false,
      }));

      return project;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to update project',
      });

      throw error;
    }
  },

  deleteProject: async (workspaceId, projectId) => {
    set({ isLoading: true, error: null });

    try {
      await deleteProjectRequest(workspaceId, projectId);

      set((state) => ({
        projects: state.projects.filter(
          (project) => project.id !== projectId
        ),
        currentProject:
          state.currentProject?.id === projectId
            ? null
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to delete project',
      });

      throw error;
    }
  },

  setCurrentProject: (project) => {
    set({
      currentProject: project,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));