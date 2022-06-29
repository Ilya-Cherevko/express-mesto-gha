const { NODE_ENV, JWT_SECRET } = process.env;

const reqExpLink = /^(https?:\/\/)(www\.)?([\w-.~:/?#[\]@!$&')(*+,;=]*\.?)*\.{1}[\w]{2,8}(\/([\w-.~:/?#[\]@!$&')(*+,;=])*)?/;

const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'secret-key';

module.exports = {
  reqExpLink,
  secretKey,
};
