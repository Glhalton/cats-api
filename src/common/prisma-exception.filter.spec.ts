import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import request from 'supertest';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';

const knownError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError(`prisma failed with ${code}`, {
    code,
    clientVersion: 'test',
  });

@Controller('boom')
class BoomController {
  @Get('missing')
  missing(): never {
    throw knownError('P2025');
  }

  @Get('duplicate')
  duplicate(): never {
    throw knownError('P2002');
  }

  @Get('foreign-key')
  foreignKey(): never {
    throw knownError('P2003');
  }

  @Get('unmapped')
  unmapped(): never {
    throw knownError('P9999');
  }

  @Get('not-prisma')
  notPrisma(): never {
    throw new Error('something else broke');
  }
}

describe('PrismaExceptionFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoomController],
    }).compile();

    app = module.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('maps P2025 (record not found) to 404', async () => {
    await request(app.getHttpServer()).get('/boom/missing').expect(404);
  });

  it('maps P2002 (unique constraint) to 409', async () => {
    await request(app.getHttpServer()).get('/boom/duplicate').expect(409);
  });

  it('maps P2003 (foreign key constraint) to 400', async () => {
    await request(app.getHttpServer()).get('/boom/foreign-key').expect(400);
  });

  it('leaves unmapped prisma codes as 500', async () => {
    await request(app.getHttpServer()).get('/boom/unmapped').expect(500);
  });

  it('does not interfere with non-prisma errors', async () => {
    await request(app.getHttpServer()).get('/boom/not-prisma').expect(500);
  });
});
