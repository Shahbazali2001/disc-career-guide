import { z } from 'zod';
import { EDUCATION_LEVELS } from '../models/User.model.js';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const updateCareerProfileSchema = z
  .object({
    educationLevel: z.enum(EDUCATION_LEVELS, {
      errorMap: () => ({ message: 'Please select a valid education level' }),
    }),
    fieldOfStudy: z
      .string({ required_error: 'Field of study is required' })
      .trim()
      .min(2, 'Field of study must be at least 2 characters')
      .max(100, 'Field of study must be at most 100 characters'),
    yearsOfExperience: z.coerce
      .number({
        required_error: 'Years of experience is required',
        invalid_type_error: 'Years of experience must be a valid number',
      })
      .int('Years of experience must be a whole number')
      .min(0, 'Years of experience cannot be negative')
      .max(60, 'Years of experience must be 60 or less'),
    age: z.coerce
      .number({
        required_error: 'Age is required',
        invalid_type_error: 'Age must be a valid number',
      })
      .int('Age must be a whole number')
      .min(14, 'Age must be at least 14')
      .max(100, 'Age must be 100 or less'),
  })
  .refine((data) => data.yearsOfExperience <= Math.max(0, data.age - 12), {
    path: ['yearsOfExperience'],
    message: 'Years of experience seems too high for the entered age',
  });
