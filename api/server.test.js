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
test('[1] sanity', () => {
  expect(true).toBe(true);
});
