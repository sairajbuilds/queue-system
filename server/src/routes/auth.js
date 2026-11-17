const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { signToken } = require('../../../server 2/src/utils/jwt');
const asyncHandler = require('../../../server 2/src/utils/asyncHandler');
const httpError = require('../../../server 2/src/utils/httpError');

const router = express.Router();

// Brute-force protection on login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

// Compared against when the email does not exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    office: user.office,
    assignedCounter: user.assignedCounter,
  };
}

router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    // typeof checks also block NoSQL-injection payloads like { "email": { "$gt": "" } }
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      throw httpError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .populate('assignedCounter', 'number label status');

    const passwordOk = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
    if (!user || !passwordOk || !user.isActive) {
      throw httpError(401, 'Invalid email or password');
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    await req.user.populate('assignedCounter', 'number label status');
    res.json({ user: publicUser(req.user) });
  })
);

router.post(
  '/change-password',
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      throw httpError(400, 'currentPassword and newPassword are required');
    }
    if (newPassword.length < 8) throw httpError(400, 'New password must be at least 8 characters');

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw httpError(401, 'Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  })
);

module.exports = router;
