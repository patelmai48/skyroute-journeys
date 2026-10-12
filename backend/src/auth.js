const jwt = require('jsonwebtoken');

function signToken(user, secret) {
  return jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '7d' });
}

function requireAuth(secret) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    try {
      const payload = jwt.verify(token, secret);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = { signToken, requireAuth };
