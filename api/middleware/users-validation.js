const jwt = require('jsonwebtoken');
const usersModel = require('../users/users-model');
const { JWT_SECRET } = require('../secrets');

const duplicateName = async (req, res, next) => {
  const username = req.body.username.trim();
  const user = await usersModel.findBy({ username });
  if (user.username === username) {
    res.status(401).json({ message: 'username taken' });
  } else {
    next();
  }
};

const verifyUsernameExists = async (req, res, next) => {
  const username = req.body.username.trim();
  const [user] = await usersModel.findBy({ username });
  if (user === undefined) {
    res.status(401).json({ message: 'invalid credentials' });
  } else {
    next();
  }
};

const validBody = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(422).json({ message: 'username and password required' });
  } else {
    next();
  }
};

module.exports = {
  duplicateName,
  verifyUsernameExists,
  validBody,
};
