import { AppError } from './errorHandler.js';

const formatIssues = (issues, prefix = '') =>
  issues.map((issue) => {
    const path = issue.path.join('.');
    return {
      field: prefix ? (path ? `${prefix}.${path}` : prefix) : path,
      message: issue.message,
    };
  });

/**
 * Generic Zod request validation middleware.
 * Accepts either a single Zod schema (validates req.body)
 * or an object with optional { body, query, params } Zod schemas.
 */
export const validateRequest = (schemaOrMap) => (req, _res, next) => {
  const isDirectSchema = typeof schemaOrMap?.safeParse === 'function';

  if (isDirectSchema) {
    const result = schemaOrMap.safeParse(req.body);
    if (!result.success) {
      return next(new AppError('Validation failed', 400, formatIssues(result.error.issues)));
    }
    req.body = result.data;
    return next();
  }

  const allErrors = [];
  const targets = ['body', 'query', 'params'];

  for (const key of targets) {
    const schema = schemaOrMap?.[key];
    if (!schema) continue;

    const result = schema.safeParse(req[key]);
    if (!result.success) {
      allErrors.push(...formatIssues(result.error.issues, key));
    } else {
      req[key] = result.data;
    }
  }

  if (allErrors.length > 0) {
    return next(new AppError('Validation failed', 400, allErrors));
  }

  return next();
};

export default validateRequest;
