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

  describe('GET /api/workspaces', () => {
    it('should return the workspaces belonging to the current user', async () => {
      const response = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('My Workspace');
      expect(response.body.data[0].slug).toBe('my-workspace');
      expect(response.body.data[0].role).toBe('OWNER');
    });

    it('should return an empty list for a user with no workspaces', async () => {
      const secondUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'workspace-empty@example.com',
          name: 'Empty Workspace User',
          password: 'password123',
        });

      const response = await request(app)
        .get('/api/workspaces')
        .set(
          'Authorization',
          `Bearer ${secondUserResponse.body.data.accessToken}`
        );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);

      await prisma.workspaceMember.deleteMany({
        where: {
          userId: secondUserResponse.body.data.user.id,
        },
      });

      await prisma.user.delete({
        where: {
          id: secondUserResponse.body.data.user.id,
        },
      });
    });

    it('should reject the request without authentication', async () => {
      const response = await request(app).get('/api/workspaces');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/workspaces/:id', () => {
    it('should return a workspace the current user belongs to', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .get(`/api/workspaces/${workspace?.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(workspace?.id);
      expect(response.body.data.name).toBe('My Workspace');
      expect(response.body.data.role).toBe('OWNER');
    });

    it('should reject access to a workspace the user does not belong to', async () => {
      const otherUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'workspace-other@example.com',
          name: 'Other Workspace User',
          password: 'password123',
        });

      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .get(`/api/workspaces/${workspace?.id}`)
        .set(
          'Authorization',
          `Bearer ${otherUserResponse.body.data.accessToken}`
        );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);

      await prisma.user.delete({
        where: {
          id: otherUserResponse.body.data.user.id,
        },
      });
    });

    it('should reject access without authentication', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app).get(
        `/api/workspaces/${workspace?.id}`
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/workspaces/:id', () => {
    it('should update a workspace successfully', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .patch(`/api/workspaces/${workspace?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Workspace',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Workspace');
      expect(response.body.data.slug).toBe('my-workspace');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.role).toBe('OWNER');
    });

    it('should reject an update without authentication', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .patch(`/api/workspaces/${workspace?.id}`)
        .send({
          name: 'Unauthorized Update',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject an empty update', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .patch(`/api/workspaces/${workspace?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should reject a duplicate workspace slug', async () => {
      await prisma.workspace.create({
        data: {
          name: 'Second Workspace',
          slug: 'second-workspace',
          members: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
      });

      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .patch(`/api/workspaces/${workspace?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          slug: 'second-workspace',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Workspace slug already exists');

      await prisma.workspace.delete({
        where: { slug: 'second-workspace' },
      });
    });

    it('should reject an invalid update', async () => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: 'my-workspace' },
      });

      const response = await request(app)
        .patch(`/api/workspaces/${workspace?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'A',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });
});0