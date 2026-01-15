import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    list: jest.fn(),
    schedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.list() должен вызвать FilmsService.list и вернуть его результат', async () => {
    const expected = { total: 1, items: [{ id: '1' }] };
    filmsServiceMock.list.mockResolvedValue(expected);
    const result = await controller.list();
    expect(filmsServiceMock.list).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('.schedule() должен вызвать FilmsService.schedule с id и вернуть результат', async () => {
    const expected = { total: 2, items: [{ id: 's1' }, { id: 's2' }] };
    filmsServiceMock.schedule.mockResolvedValue(expected);
    const result = await controller.schedule({ id: '10' });
    expect(filmsServiceMock.schedule).toHaveBeenCalledTimes(1);
    expect(filmsServiceMock.schedule).toHaveBeenCalledWith('10');
    expect(result).toEqual(expected);
  });
});
