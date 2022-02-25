const db = require('../../data/dbConfig');

module.exports = {
  findAll,
  findBy,
  findById,
  insert,
  updateName,
  deleteUser,
};

function findAll() {
  return db('users');
}

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

async function updateName(id, changes) {
  await db('users').update({ name: changes.name }).where('id', id);
  return findById(id);
}

async function deleteUser(id) {
  const result = await findById(id);
  await db('users').where('id', id).del();
  return result;
}
