import request from 'supertest';
import { prisma } from '@db/prisma';
import app from '@/app';

describe('Workspace Module', () => {
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'workspace-test@example.com',
        name: 'Workspace Test User',
        password: 'password123',
      });

    accessToken = response.body.data.accessToken;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/workspaces', () => {
    it('should create a workspace and make the user its owner', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'My Workspace',
          slug: 'my-workspace',
          description: 'A test workspace',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('My Workspace');
      expect(response.body.data.slug).toBe('my-workspace');
      expect(response.body.data.description).toBe('A test workspace');
      expect(response.body.data.role).toBe('OWNER');

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId: response.body.data.id,
          },
        },
      });

      expect(membership).not.toBeNull();
      expect(membership?.role).toBe('OWNER');
    });

    it('should reject a workspace request without authentication', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .send({
          name: 'Unauthorized Workspace',
          slug: 'unauthorized-workspace',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate workspace slugs', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Another Workspace',
          slug: 'my-workspace',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Workspace slug already exists');
    });

    it('should reject invalid workspace data', async () => {
      const response = await request(app)
        .post('/api/workspaces')
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
});