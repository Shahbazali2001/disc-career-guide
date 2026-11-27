import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';
import { isCareerProfileComplete, User } from '../models/User.model.js';

const signToken = (userId) =>
  jwt.sign({ sub: userId.toString() }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const sanitizeUser = (user) => {
  const careerProfile = user.careerProfile || null;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    careerProfile,
    hasCareerProfile: isCareerProfileComplete(careerProfile),
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return next(new AppError('An account with this email already exists.', 409));
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const token = signToken(user._id);

    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

export const getMe = (req, res) => {
  res.status(200).json({
    user: sanitizeUser(req.user),
  });
};

export const updateCareerProfile = async (req, res, next) => {
  try {
    const { educationLevel, fieldOfStudy, yearsOfExperience, age } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          careerProfile: {
            educationLevel,
            fieldOfStudy,
            yearsOfExperience,
            age,
            completedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    )
      .select('_id name email careerProfile')
      .lean();

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};
