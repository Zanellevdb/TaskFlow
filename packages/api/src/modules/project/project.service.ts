import { prisma } from '@db/prisma';
import { ApiError } from '@utils/ApiError';
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from './project.validation';

export class ProjectService {
  async createProject(
    userId: string,
    workspaceId: string,
    data: CreateProjectRequest
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ApiError(
        403,
        'Only workspace owners and admins can create projects'
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        workspaceId_slug: {
          workspaceId,
          slug: data.slug,
        },
      },
    });

    if (existingProject) {
      throw new ApiError(409, 'Project slug already exists');
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        workspaceId,
      },
    });

    return project;
  }

  async getWorkspaceProjects(
    userId: string,
    workspaceId: string
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    return prisma.project.findMany({
      where: { workspaceId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getProjectById(
    userId: string,
    workspaceId: string,
    projectId: string
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    return project;
  }

  async updateProject(
    userId: string,
    workspaceId: string,
    projectId: string,
    data: UpdateProjectRequest
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ApiError(
        403,
        'Only workspace owners and admins can update projects'
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (data.slug) {
      const existingProject = await prisma.project.findFirst({
        where: {
          workspaceId,
          slug: data.slug,
          id: { not: projectId },
        },
      });

      if (existingProject) {
        throw new ApiError(409, 'Project slug already exists');
      }
    }

    return prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
    });
  }

  async deleteProject(
    userId: string,
    workspaceId: string,
    projectId: string
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    if (membership.role !== 'OWNER') {
      throw new ApiError(
        403,
        'Only the workspace owner can delete projects'
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

export const projectService = new ProjectService();