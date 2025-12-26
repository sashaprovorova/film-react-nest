import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

describe('FilmsService', () => {
  let service: FilmsService;

  const repositoryMock = {
    findAll: jest.fn(),
    findScheduleByFilmId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.list() должен вызвать repository.findAll и вернуть результат', async () => {
    const expected = { total: 1, items: [{ id: '1' }] };
    repositoryMock.findAll.mockResolvedValue(expected);
    const result = await service.list();
    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('.schedule() должен вызвать repository.findScheduleByFilmId с id и вернуть результат', async () => {
    const expected = { total: 0, items: [] };
    repositoryMock.findScheduleByFilmId.mockResolvedValue(expected);
    const result = await service.schedule('10');
    expect(repositoryMock.findScheduleByFilmId).toHaveBeenCalledTimes(1);
    expect(repositoryMock.findScheduleByFilmId).toHaveBeenCalledWith('10');
    expect(result).toEqual(expected);
  });
});
