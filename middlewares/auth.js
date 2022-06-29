const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils/constants');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(401('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(401('Необходима авторизация'));
    return;
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  next();
};
