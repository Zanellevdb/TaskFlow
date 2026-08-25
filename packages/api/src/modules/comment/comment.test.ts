import request from 'supertest';
import { prisma } from '@db/prisma';
import app from '@/app';

describe('Comment Module', () => {
  let accessToken: string;
  let workspaceId: string;
  let taskId: string;
  let commentId: string;

  beforeAll(async () => {
    await prisma.taskLabel.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'comment-test@example.com',
        name: 'Comment Test User',
        password: 'password123',
      });

    accessToken = response.body.data.accessToken;

    const workspaceResponse = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Comment Test Workspace',
        slug: 'comment-test-workspace',
      });

    workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post(`/api/projects/${workspaceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Comment Test Project',
        slug: 'comment-test-project',
      });

    const taskResponse = await request(app)
      .post(`/api/tasks/${workspaceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Comment Test Task',
        projectId: projectResponse.body.data.id,
      });

    taskId = taskResponse.body.data.id;
  });

  afterAll(async () => {
    await prisma.taskLabel.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/comments/:workspaceId/:taskId', () => {
    it('should create a comment successfully', async () => {
      const response = await request(app)
        .post(`/api/comments/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'This is a test comment',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe(
        'This is a test comment'
      );
      expect(response.body.data.taskId).toBe(taskId);
      expect(response.body.data.author.name).toBe(
        'Comment Test User'
      );

      commentId = response.body.data.id;
    });

    it('should reject an empty comment', async () => {
      const response = await request(app)
        .post(`/api/comments/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should reject a comment without authentication', async () => {
      const response = await request(app)
        .post(`/api/comments/${workspaceId}/${taskId}`)
        .send({
          content: 'Unauthorized comment',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject a comment for a nonexistent task', async () => {
      const response = await request(app)
        .post(`/api/comments/${workspaceId}/nonexistent-task-id`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Invalid task comment',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('GET /api/comments/:workspaceId/:taskId', () => {
    it('should return all comments for a task', async () => {
      const secondComment = await request(app)
        .post(`/api/comments/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Second test comment',
        });

      expect(secondComment.status).toBe(201);

      const response = await request(app)
        .get(`/api/comments/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].content).toBe(
        'This is a test comment'
      );
      expect(response.body.data[1].content).toBe(
        'Second test comment'
      );
    });

    it('should reject access without authentication', async () => {
      const response = await request(app).get(
        `/api/comments/${workspaceId}/${taskId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject a nonexistent task', async () => {
      const response = await request(app)
        .get(`/api/comments/${workspaceId}/nonexistent-task-id`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('DELETE /api/comments/:workspaceId/:taskId/:id', () => {
    it('should delete a comment successfully', async () => {
      const response = await request(app)
        .delete(
          `/api/comments/${workspaceId}/${taskId}/${commentId}`
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Comment deleted successfully'
      );

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      expect(comment).toBeNull();
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app).delete(
        `/api/comments/${workspaceId}/${taskId}/${commentId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject deletion of a nonexistent comment', async () => {
      const response = await request(app)
        .delete(
          `/api/comments/${workspaceId}/${taskId}/nonexistent-comment-id`
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Comment not found');
    });
  });
});