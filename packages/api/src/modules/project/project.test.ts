import request from 'supertest';
import { prisma } from '@db/prisma';
import app from '@/app';

describe('Project Module', () => {
  let accessToken: string;
  let userId: string;
  let workspaceId: string;
  let projectId: string;

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'project-test@example.com',
        name: 'Project Test User',
        password: 'password123',
      });

    accessToken = response.body.data.accessToken;
    userId = response.body.data.user.id;

    const workspaceResponse = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Project Test Workspace',
        slug: 'project-test-workspace',
        description: 'Workspace for project tests',
      });

    workspaceId = workspaceResponse.body.data.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/projects/:workspaceId', () => {
    it('should create a project successfully', async () => {
      const response = await request(app)
        .post(`/api/projects/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'My Project',
          slug: 'my-project',
          description: 'A test project',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('My Project');
      expect(response.body.data.slug).toBe('my-project');
      expect(response.body.data.description).toBe('A test project');
      expect(response.body.data.workspaceId).toBe(workspaceId);

      projectId = response.body.data.id;
    });

    it('should reject project creation without authentication', async () => {
      const response = await request(app)
        .post(`/api/projects/${workspaceId}`)
        .send({
          name: 'Unauthorized Project',
          slug: 'unauthorized-project',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate project slugs within the same workspace', async () => {
      const response = await request(app)
        .post(`/api/projects/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Another Project',
          slug: 'my-project',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project slug already exists');
    });

    it('should reject invalid project data', async () => {
      const response = await request(app)
        .post(`/api/projects/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'A',
          slug: 'Invalid Slug',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/projects/:workspaceId', () => {
    it('should return all projects in the workspace', async () => {
      const response = await request(app)
        .get(`/api/projects/${workspaceId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('My Project');
      expect(response.body.data[0].slug).toBe('my-project');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app).get(
        `/api/projects/${workspaceId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects/:workspaceId/:id', () => {
    it('should return a project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${workspaceId}/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(projectId);
      expect(response.body.data.name).toBe('My Project');
      expect(response.body.data.workspaceId).toBe(workspaceId);
    });

    it('should reject a project that does not exist', async () => {
      const response = await request(app)
        .get(`/api/projects/${workspaceId}/nonexistent-project-id`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project not found');
    });
  });

  describe('PATCH /api/projects/:workspaceId/:id', () => {
    it('should update a project successfully', async () => {
      const response = await request(app)
        .patch(`/api/projects/${workspaceId}/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Project',
          description: 'Updated project description',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Project');
      expect(response.body.data.slug).toBe('my-project');
      expect(response.body.data.description).toBe(
        'Updated project description'
      );
    });

    it('should reject an empty update', async () => {
      const response = await request(app)
        .patch(`/api/projects/${workspaceId}/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should reject an update without authentication', async () => {
      const response = await request(app)
        .patch(`/api/projects/${workspaceId}/${projectId}`)
        .send({
          name: 'Unauthorized Update',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/projects/:workspaceId/:id', () => {
    it('should delete a project successfully', async () => {
      const response = await request(app)
        .delete(`/api/projects/${workspaceId}/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project deleted successfully');

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      expect(project).toBeNull();
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app).delete(
        `/api/projects/${workspaceId}/${projectId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});