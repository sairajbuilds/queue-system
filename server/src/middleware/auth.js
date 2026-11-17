const User = require('../models/User');
const { verifyToken } = require('../../../server 2/src/utils/jwt');

// Verifies the Bearer token and loads the current user (so deactivated accounts lose access immediately).
async function authenticate(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account not found or disabled' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// Role-based access control. Usage: router.use(authenticate, authorize('admin'))
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
