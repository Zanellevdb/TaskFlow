import request from 'supertest';
import { prisma } from '@db/prisma';
import app from '@/app';

describe('Task Label Module', () => {
  let accessToken: string;
  let workspaceId: string;
  let taskId: string;
  let labelId: string;

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
        email: 'task-label-test@example.com',
        name: 'Task Label Test User',
        password: 'password123',
      });

    accessToken = response.body.data.accessToken;

    const workspaceResponse = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Label Test Workspace',
        slug: 'label-test-workspace',
      });

    workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post(`/api/projects/${workspaceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Label Test Project',
        slug: 'label-test-project',
      });

    const taskResponse = await request(app)
      .post(`/api/tasks/${workspaceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Label Test Task',
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

  describe('POST /api/task-labels/:workspaceId/:taskId', () => {
    it('should create a task label successfully', async () => {
      const response = await request(app)
        .post(`/api/task-labels/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Bug',
          color: '#ef4444',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Bug');
      expect(response.body.data.color).toBe('#ef4444');
      expect(response.body.data.taskId).toBe(taskId);

      labelId = response.body.data.id;
    });

    it('should use the default color when no color is provided', async () => {
      const response = await request(app)
        .post(`/api/task-labels/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Feature',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Feature');
      expect(response.body.data.color).toBe('#3b82f6');
    });

    it('should reject label creation without authentication', async () => {
      const response = await request(app)
        .post(`/api/task-labels/${workspaceId}/${taskId}`)
        .send({
          name: 'Unauthorized',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid label data', async () => {
      const response = await request(app)
        .post(`/api/task-labels/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '',
          color: 'not-a-color',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should reject a nonexistent task', async () => {
      const response = await request(app)
        .post(`/api/task-labels/${workspaceId}/nonexistent-task-id`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Bug',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('GET /api/task-labels/:workspaceId/:taskId', () => {
    it('should return all labels for a task', async () => {
      const response = await request(app)
        .get(`/api/task-labels/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Bug');
      expect(response.body.data[1].name).toBe('Feature');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app).get(
        `/api/task-labels/${workspaceId}/${taskId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/task-labels/:workspaceId/:taskId/:id', () => {
    it('should delete a task label successfully', async () => {
      const response = await request(app)
        .delete(`/api/task-labels/${workspaceId}/${taskId}/${labelId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Task label deleted successfully'
      );

      const label = await prisma.taskLabel.findUnique({
        where: { id: labelId },
      });

      expect(label).toBeNull();
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app).delete(
        `/api/task-labels/${workspaceId}/${taskId}/${labelId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject a nonexistent label', async () => {
      const response = await request(app)
        .delete(
          `/api/task-labels/${workspaceId}/${taskId}/nonexistent-label-id`
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Label not found');
    });
  });
});