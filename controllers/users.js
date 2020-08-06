const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const AuthorizationError = require('../errors/authorization-error');
const BadRequest = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) throw new NotFoundError('Пользователь не найден');
      else res.send({ email: data.email, name: data.name });
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'best-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new AuthorizationError('Ошибка аутентификации')));
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequest('Ошибка валидации данных'));
      else if (err.code === 11000) next(new ConflictError('Пользователь с таким email существует'));
      else next(err);
    });
};

module.exports = { getUserInfo, login, createUser };
