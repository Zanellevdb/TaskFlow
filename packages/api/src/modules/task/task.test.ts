import request from 'supertest';
import { prisma } from '@db/prisma';
import app from '@/app';

describe('Task Module', () => {
  let accessToken: string;
  let userId: string;
  let workspaceId: string;
  let projectId: string;
  let taskId: string;

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
        email: 'task-test@example.com',
        name: 'Task Test User',
        password: 'password123',
      });

    accessToken = response.body.data.accessToken;
    userId = response.body.data.user.id;

    const workspaceResponse = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Task Test Workspace',
        slug: 'task-test-workspace',
        description: 'Workspace for task tests',
      });

    workspaceId = workspaceResponse.body.data.id;

    const projectResponse = await request(app)
      .post(`/api/projects/${workspaceId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Task Test Project',
        slug: 'task-test-project',
        description: 'Project for task tests',
      });

    projectId = projectResponse.body.data.id;
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

  describe('POST /api/tasks/:workspaceId', () => {
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post(`/api/tasks/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'My Task',
          description: 'A test task',
          projectId,
          status: 'TODO',
          priority: 'HIGH',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('My Task');
      expect(response.body.data.description).toBe('A test task');
      expect(response.body.data.status).toBe('TODO');
      expect(response.body.data.priority).toBe('HIGH');
      expect(response.body.data.projectId).toBe(projectId);
      expect(response.body.data.workspaceId).toBe(workspaceId);

      taskId = response.body.data.id;
    });

    it('should reject task creation without authentication', async () => {
      const response = await request(app)
        .post(`/api/tasks/${workspaceId}`)
        .send({
          title: 'Unauthorized Task',
          projectId,
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject an invalid project', async () => {
      const response = await request(app)
        .post(`/api/tasks/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Invalid Project Task',
          projectId: 'nonexistent-project-id',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project not found');
    });

    it('should reject invalid task data', async () => {
      const response = await request(app)
        .post(`/api/tasks/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'A',
          projectId,
          priority: 'INVALID',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/tasks/:workspaceId', () => {
    it('should return all tasks in the workspace', async () => {
      const response = await request(app)
        .get(`/api/tasks/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(taskId);
      expect(response.body.data[0].title).toBe('My Task');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app).get(
        `/api/tasks/${workspaceId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/:workspaceId/:id', () => {
    it('should return a task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('My Task');
      expect(response.body.data.projectId).toBe(projectId);
    });

    it('should reject a task that does not exist', async () => {
      const response = await request(app)
        .get(`/api/tasks/${workspaceId}/nonexistent-task-id`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('PATCH /api/tasks/:workspaceId/:id', () => {
    it('should update a task successfully', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Task',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task');
      expect(response.body.data.status).toBe('IN_PROGRESS');
      expect(response.body.data.priority).toBe('URGENT');
    });

    it('should reject an empty update', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should reject an update without authentication', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .send({
          title: 'Unauthorized Update',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject an invalid assignee', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          assigneeId: 'nonexistent-user-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Assignee must be a member of the workspace'
      );
    });

    it('should assign the task to a workspace member', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          assigneeId: userId,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.assigneeId).toBe(userId);
      expect(response.body.data.assignee.id).toBe(userId);
    });

    it('should allow removing the task assignee', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          assigneeId: null,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.assigneeId).toBeNull();
    });
  });

  describe('DELETE /api/tasks/:workspaceId/:id', () => {
    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${workspaceId}/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });

      expect(task).toBeNull();
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app).delete(
        `/api/tasks/${workspaceId}/${taskId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});