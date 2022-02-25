const db = require('../../data/dbConfig');

module.exports = {
  findAll,
  findBy,
  findById,
  insert,
  updateName,
  deleteUser,
};

function findAll() {}

function findById(id) {
  return db('users').where('id', id).first();
}

function findBy(filter) {
  return db('users').where(filter);
}

async function insert(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}

async function updateName(id, changes) {}

async function deleteUser(id) {}
