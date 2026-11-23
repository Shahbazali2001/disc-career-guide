import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.model.js';
import { AppError } from './errorHandler.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please provide a Bearer token.', 401));
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return next(new AppError('Authentication token is missing.', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const userId = decoded.sub || decoded.id;

    if (!userId) {
      return next(new AppError('Invalid authentication token payload.', 401));
    }

    const user = await User.findById(userId).select('_id name email').lean();
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return next(
        new AppError(
          err.name === 'TokenExpiredError'
            ? 'Authentication token has expired.'
            : 'Invalid authentication token.',
          401
        )
      );
    }
    return next(err);
  }
};

export default protect;
