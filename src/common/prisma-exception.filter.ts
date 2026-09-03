import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';

/**
 * Translates the Prisma error codes that map cleanly onto HTTP semantics.
 * Anything not listed here is delegated untouched, so it still surfaces as 500.
 */
const toHttpException = (
  error: Prisma.PrismaClientKnownRequestError,
): HttpException | undefined => {
  switch (error.code) {
    case 'P2025':
      return new NotFoundException('Record not found');
    case 'P2002':
      return new ConflictException('Record already exists');
    case 'P2003':
      return new BadRequestException('Related record does not exist');
    default:
      return undefined;
  }
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    super.catch(toHttpException(error) ?? error, host);
  }
}
