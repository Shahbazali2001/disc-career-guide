import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createAssessmentSchema = z.object({
  answers: z
    .array(
      z
        .number({
          required_error: 'Each answer must be a number',
          invalid_type_error: 'Each answer must be a number',
        })
        .int('Each answer must be an integer')
        .min(1, 'Answers must be between 1 and 5')
        .max(5, 'Answers must be between 1 and 5'),
      { required_error: 'Answers array is required' }
    )
    .length(12, 'Answers must contain exactly 12 integers (1–5)'),
});

export const assessmentIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid assessment ID'),
});
