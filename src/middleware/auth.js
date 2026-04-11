import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message:'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id,
      { attributes:{ exclude:['password'] } });
    if (!user || !user.isActive)
      return res.status(401).json({ message:'Invalid token' });
    req.user = user;
    next();
  } catch(e) {
    return res.status(401).json({ message: e.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message:'Admin only' });
  next();
};

export const generateToken = (user) =>
  jwt.sign(
    { id:user.id, email:user.email, role:user.role },
    process.env.JWT_SECRET,
    { expiresIn:'24h' }
  );