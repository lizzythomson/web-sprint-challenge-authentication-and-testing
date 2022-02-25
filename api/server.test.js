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

describe('test the usersModel', () => {
  test('[1] the table is empty', async () => {
    const books = await db('users');
    expect(books).toHaveLength(0);
  });
  test('[2] multiple users get inserted', async () => {
    await usersModel.insert({
      username: 'sammysosa',
      password: '12345',
    });
    let books = await db('users');
    expect(books).toHaveLength(1);

    await usersModel.insert({
      username: 'charlie',
      password: '7890',
    });
    books = await db('users');
    expect(books).toHaveLength(2);
  });
  test('[3] can get by id', async () => {
    const { id } = await usersModel.insert({
      username: 'paul',
      password: '12345',
    });
    const result = await usersModel.findById(id);
    expect(result).toHaveProperty('username', 'paul');
  });
});

describe('authentication', () => {
  describe('[POST] /api/auth/register', () => {
    test('[4] responds with correct message on empty body', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: '' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[5] responds with correct message on empty username', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: '12345' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[6] responds with correct message on empty password', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'sammy', password: '' });
      expect(result.body.message).toMatch(/username and password required/i);
    });
    test('[7] responds with the correct message on valid credentials', async () => {
      const result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'sara', password: '1234' });
      expect(result.body).toHaveProperty('username', 'sara');
    });
  });
  describe('[POST] /api/auth/login', () => {
    test('[8] responds with correct message on valid credentials', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'cammie', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'cammie', password: '1234' });
      expect(result.body.message).toMatch(/welcome, cammie/i);
    });
    test('[9] responds with correct message on invalid password', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'jenny', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'jenny', password: '8765' });
      expect(result.body.message).toMatch(/invalid credentials/i);
    });
    test('[10] responds with correct message on invalid username', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'ally', password: '1234' });
      const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'allison', password: '1234' });
      expect(result.body.message).toMatch(/invalid credentials/i);
    });
  });
});
