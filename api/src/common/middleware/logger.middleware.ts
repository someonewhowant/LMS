import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, body } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      // Log request method, URL, status code, and safely print request body (excluding passwords)
      const safeBody = { ...body };
      if (safeBody.password) {
        safeBody.password = '********';
      }
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${userAgent} - Body: ${JSON.stringify(safeBody)}`
      );
    });

    next();
  }
}
