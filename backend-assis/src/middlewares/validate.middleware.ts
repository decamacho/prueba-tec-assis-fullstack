import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response.js';

export const validate = (schema: ZodSchema, source: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source];

    if (source === 'body' && (data === undefined || data === null || typeof data !== 'object' || Object.keys(data).length === 0)) {
      sendError(res, 'El cuerpo de la solicitud no puede estar vacío. Debe enviar un JSON válido con los campos requeridos.', 400);
      return;
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      const messages = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      sendError(res, messages, 400);
      return;
    }
    if (source === 'body') {
      req.body = result.data;
    } else {
      (req as any).validatedQuery = result.data;
    }
    next();
  };
};
