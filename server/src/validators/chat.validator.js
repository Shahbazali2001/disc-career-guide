import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const sendChatMessageSchema = z.object({
  assessmentId: z
    .string({ required_error: 'assessmentId is required' })
    .trim()
    .regex(objectIdRegex, 'Invalid assessmentId'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message must be between 1 and 1500 characters')
    .max(1500, 'Message must be between 1 and 1500 characters'),
});

export const chatAssessmentIdParamSchema = z.object({
  assessmentId: z.string().trim().regex(objectIdRegex, 'Invalid assessmentId'),
});
