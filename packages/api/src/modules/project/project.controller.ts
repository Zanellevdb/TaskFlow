import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { projectService } from './project.service';
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from './project.validation';

export class ProjectController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const project = await projectService.createProject(
      req.user.userId,
      req.params.workspaceId,
      req.body as CreateProjectRequest
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  }

  async getMine(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const projects = await projectService.getWorkspaceProjects(
      req.user.userId,
      req.params.workspaceId
    );

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
    });
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const project = await projectService.getProjectById(
      req.user.userId,
      req.params.workspaceId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const project = await projectService.updateProject(
      req.user.userId,
      req.params.workspaceId,
      req.params.id,
      req.body as UpdateProjectRequest
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await projectService.deleteProject(
      req.user.userId,
      req.params.workspaceId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  }
}

export const projectController = new ProjectController();