import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError) {
    const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    sendError(res, messages, 400);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'El JSON enviado no es válido. Verifique el formato de la solicitud.', 400);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error('Error no manejado:', err);
  sendError(res, 'Error interno del servidor', 500);
};
