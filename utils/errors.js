const BAD_REQ_ERR_CODE = 400;
// const BAD_REQ_NOT_FOUND = 404;
const DEF_ERR_CODE = 500;

const error = (err, res, errorName, errorMessage) => {
  if (err.name === errorName) {
    return res.status(BAD_REQ_ERR_CODE).send({
      message: errorMessage,
    });
  }
  return res.status(DEF_ERR_CODE).send({ message: '500 — ошибка по-умолчанию' });
};

module.exports = {
  error,
  BAD_REQ_ERR_CODE,
  DEF_ERR_CODE,
};
