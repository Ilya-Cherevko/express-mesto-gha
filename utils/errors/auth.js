module.exports = class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
