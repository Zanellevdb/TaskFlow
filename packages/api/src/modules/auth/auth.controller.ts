import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { authService } from './auth.service';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
} from './auth.validation';
import logger from '@config/logger';

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.register(req.body as RegisterRequest);

    logger.info(`User registered: ${result.user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.login(req.body as LoginRequest);

    logger.info(`User logged in: ${result.user.email}`);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body as RefreshTokenRequest;

    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user = await authService.getCurrentUser(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  async logout(_req: AuthRequest, res: Response): Promise<void> {
    await authService.logout();

    res.clearCookie('refreshToken');

    logger.info('User logged out');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export const authController = new AuthController();