const request = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');
const usersModel = require('./users/users-model');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

// Write your tests here
test('[0] sanity', () => {
  expect(true).toBe(true);
});

describe('authentication for register', () => {
  describe('[POST] /api/auth/register', () => {
    test('[1] responds with correct message on empty body', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: '' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[2] responds with correct message on empty username', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: '12345' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[3] responds with correct message on empty password', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[4] responds with the correct message on valid credentials', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '1234' });
      expect(result.body).toHaveProperty('username', 'sammy');
    });
  });
});
