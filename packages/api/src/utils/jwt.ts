import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '@config/env';
import { ApiError } from './ApiError';

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (
  userId: string,
  email: string
): string => {
  return jwt.sign(
    { userId, email },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    }
  );
};

export const generateRefreshToken = (
  userId: string,
  email: string
): string => {
  return jwt.sign(
    { userId, email },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn as SignOptions['expiresIn'],
    }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (typeof payload === 'string') {
      throw new ApiError(401, 'Invalid token');
    }

    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Access token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid access token');
    }

    throw new ApiError(401, 'Token verification failed');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, env.jwtRefreshSecret);

    if (typeof payload === 'string') {
      throw new ApiError(401, 'Invalid token');
    }

    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Refresh token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    throw new ApiError(401, 'Token verification failed');
  }
};

export const extractTokenFromHeader = (
  authHeader?: string
): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(
      401,
      'Missing or invalid authorization header'
    );
  }

  return authHeader.substring(7);
};