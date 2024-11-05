import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const notFound = (_req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error('Not Found');

  next(error);
};

export const errorHandler: ErrorRequestHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const responseBody = {
    message: error.message,
    stack: error.stack,
  };

  console.error('Error: ', responseBody);
  res.json(responseBody);
};
