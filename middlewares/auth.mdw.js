const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = process.env;

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      console.log('error');
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Access token not found' });
  }
};
