const jwt = require('jsonwebtoken');
const UnautorizedError = require('../errors/UnautorizedError');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('jwt=')) {
    throw new UnautorizedError('Invalid Token');
  }
  const jwtToken = authorization.replace('jwt=', '');

  let payload;

  try {
    payload = jwt.verify(jwtToken, 'secret-key');
  } catch (error) {
    throw new UnautorizedError('Invalid Token');
  }
  req.user = payload;
  next();
};
