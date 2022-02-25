const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index');
const bcrypt = require('bcryptjs');
const usersModel = require('../users/users-model');
const {
  duplicateName,
  validBody,
  verifyUsernameExists,
} = require('../middleware/users-validation');

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
router.post('/register', validBody, duplicateName, async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 4);
    const user = { username, password: hash };
    const createdUser = await usersModel.insert(user);
    res.status(201).json(createdUser);
  } catch {
    res.status(500).json({ message: 'server error, please try again later' });
  }
});

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
router.post('/login', validBody, verifyUsernameExists, (req, res) => {
  const { username, password } = req.body;
  usersModel
    .findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${username}`, token });
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'server error, please try again later' });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
    role_name: user.role_name,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

module.exports = router;
