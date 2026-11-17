const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../../server/src/config/env');

function signToken(user) {
  return jwt.sign(
    { role: user.role, office: String(user.office) },
    jwtSecret,
    { subject: String(user._id), expiresIn: jwtExpiresIn, algorithm: 'HS256' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
}

module.exports = { signToken, verifyToken };
