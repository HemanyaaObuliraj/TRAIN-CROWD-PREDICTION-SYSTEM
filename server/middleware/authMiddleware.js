const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    console.log('JWT Secret:', process.env.JWT_SECRET);
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.log('Error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};