import { create } from 'zustand';
import {
  getWorkspaceMembers,
  type WorkspaceMember,
} from '../api/members';

interface MemberState {
  members: WorkspaceMember[];
  isLoading: boolean;
  error: string | null;

  fetchMembers: (
    workspaceId: string
  ) => Promise<void>;

  clearMembers: () => void;
  clearError: () => void;
}

export const useMemberStore = create<MemberState>(
  (set) => ({
    members: [],
    isLoading: false,
    error: null,

    fetchMembers: async (workspaceId) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const members =
          await getWorkspaceMembers(workspaceId);

        set({
          members,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: 'Failed to load workspace members',
        });

        throw error;
      }
    },

    clearMembers: () => {
      set({
        members: [],
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