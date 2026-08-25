import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { commentService } from './comment.service';
import { CreateCommentRequest } from './comment.validation';

export class CommentController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const comment = await commentService.createComment(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId,
      req.body as CreateCommentRequest
    );

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
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

    const comments = await commentService.getTaskComments(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId
    );

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
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

    await commentService.deleteComment(
      req.user.userId,
      req.params.workspaceId,
      req.params.taskId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  }
}

export const commentController = new CommentController();