import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { workspaceService } from './workspace.service';
import { CreateWorkspaceRequest } from './workspace.validation';

export class WorkspaceController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const workspace = await workspaceService.createWorkspace(
      req.user.userId,
      req.body as CreateWorkspaceRequest
    );

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: workspace,
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

    const workspaces = await workspaceService.getUserWorkspaces(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: 'Workspaces retrieved successfully',
      data: workspaces,
    });
  }
}

export const workspaceController = new WorkspaceController();