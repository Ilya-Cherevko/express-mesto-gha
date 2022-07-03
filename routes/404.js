const NotFoundError = require('../utils/errors/not-found');

module.exports = (req, res, next) => {
  next(new NotFoundError('Страница не найдена. Проверьте URL и метод запроса'));
};
