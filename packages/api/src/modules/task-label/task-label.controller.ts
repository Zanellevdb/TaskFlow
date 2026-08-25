import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { taskLabelService } from './task-label.service';
import { CreateTaskLabelRequest } from './task-label.validation';

export class TaskLabelController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const label = await taskLabelService.createLabel(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId,
      req.body as CreateTaskLabelRequest
    );

    res.status(201).json({
      success: true,
      message: 'Task label created successfully',
      data: label,
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

    const labels = await taskLabelService.getTaskLabels(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId
    );

    res.status(200).json({
      success: true,
      message: 'Task labels retrieved successfully',
      data: labels,
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

    await taskLabelService.deleteLabel(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Task label deleted successfully',
    });
  }
}

export const taskLabelController = new TaskLabelController();