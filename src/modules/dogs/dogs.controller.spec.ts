import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DogsController } from './dogs.controller.js';
import { DogsService } from './dogs.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { createValidationPipe } from '../../common/validation-pipe.js';

describe('DogsController', () => {
  let controller: DogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogsController],
      providers: [
        DogsService,
        { provide: PrismaService, useValue: { dog: {} } },
      ],
    }).compile();

    controller = module.get<DogsController>(DogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('DogsController validation', () => {
  let app: INestApplication;
  let create: ReturnType<typeof vi.fn>;
  let remove: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    create = vi.fn().mockResolvedValue({ id: 'abc' });
    remove = vi.fn().mockResolvedValue({ id: 'abc' });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogsController],
      providers: [{ provide: DogsService, useValue: { create, remove } }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('accepts a valid body and forwards it to the service', async () => {
    await request(app.getHttpServer())
      .post('/dogs')
      .send({ name: 'Alpha', age: 3, breed: 'common' })
      .expect(201);

    expect(create).toHaveBeenCalledWith({
      name: 'Alpha',
      age: 3,
      breed: 'common',
    });
  });

  it('rejects a missing name', async () => {
    await request(app.getHttpServer())
      .post('/dogs')
      .send({ age: 3, breed: 'common' })
      .expect(400);

    expect(create).not.toHaveBeenCalled();
  });

  it('rejects an age that is not a number', async () => {
    await request(app.getHttpServer())
      .post('/dogs')
      .send({ name: 'Alpha', age: 'three', breed: 'common' })
      .expect(400);

    expect(create).not.toHaveBeenCalled();
  });

  it('rejects unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/dogs')
      .send({ name: 'Alpha', age: 3, breed: 'common', unexpected: true })
      .expect(400);

    expect(create).not.toHaveBeenCalled();
  });

  it('delegates delete to the service instead of returning a canned string', async () => {
    await request(app.getHttpServer()).delete('/dogs/abc').expect(200);

    expect(remove).toHaveBeenCalledWith('abc');
  });
});
