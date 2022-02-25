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

describe('authentication', () => {
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
  describe('[POST] /api/auth/login', () => {
    test('[5] responds with correct message on valid credentials', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'sammy', password: '1234' });
      expect(result.body.message).toMatch(/welcome, sammy/i);
    });
    test('[6] responds with correct message on invalid password', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'sammy', password: '9876' });
      expect(result.body.message).toMatch(/invalid credentials/i);
    });
    test('[7] responds with correct message on invalid username', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'sally', password: '1234' });
      expect(result.body.message).toMatch(/invalid credentials/i);
    });
  });
});
