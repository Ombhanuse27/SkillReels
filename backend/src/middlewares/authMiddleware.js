import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    // FIX: Add the same fallback secret used in authService.js
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
    
    const decoded = jwt.verify(token, secret);
    
    // If your login signed { id: user.id }, decoded will be an object with an 'id'.
    // req.user becomes { id: 'some-uuid' }, which perfectly matches req.user.id in your controllers!
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default authenticate;