import { NextRequest } from 'next/server';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { GET as usersHandler } from '@/app/api/users/route';
import { GET as userHandler } from '@/app/api/users/[id]/route';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

describe('API Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user successfully', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongP@ss123',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.password).toBeUndefined(); // Never return password
    });

    it('returns 400 for missing fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test User' }),
      });

      const response = await registerHandler(request);
      expect(response.status).toBe(400);
    });

    it('returns 409 for duplicate email', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'StrongP@ss123',
        }),
      });

      const response = await registerHandler(request);
      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/users', () => {
    it('returns paginated user list', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@test.com' },
        { id: '2', name: 'User 2', email: 'user2@test.com' },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const request = new NextRequest(
        'http://localhost:3000/api/users?page=1&limit=10'
      );
      const response = await usersHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(2);
    });

    it('handles search query', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const request = new NextRequest(
        'http://localhost:3000/api/users?search=john'
      );
      const response = await usersHandler(request);

      expect(response.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.objectContaining({ contains: 'john' }) }),
            ]),
          }),
        })
      );
    });
  });

  describe('GET /api/users/[id]', () => {
    it('returns a single user', async () => {
      const mockUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@test.com',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost:3000/api/users/1');
      const response = await userHandler(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user.name).toBe('User 1');
    });

    it('returns 404 for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/users/999');
      const response = await userHandler(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });
});