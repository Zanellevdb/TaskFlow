import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment content must be at most 2000 characters'),
});

export type CreateCommentRequest = z.infer<
  typeof createCommentSchema
>;