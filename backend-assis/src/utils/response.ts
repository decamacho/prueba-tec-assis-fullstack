import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T | null;
  status: 'success' | 'error';
}

export function sendSuccess<T>(res: Response, data: T, message = 'Operación exitosa', statusCode = 200): void {
  const response: ApiResponse<T> = {
    statusCode,
    message,
    data,
    status: 'success',
  };
  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 500, data: unknown = null): void {
  const response: ApiResponse = {
    statusCode,
    message,
    data,
    status: 'error',
  };
  res.status(statusCode).json(response);
}
