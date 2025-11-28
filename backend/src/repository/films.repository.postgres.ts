import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { FilmsRepository, FilmDoc } from './films.repository';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { plainToInstance } from 'class-transformer';
import {
  FilmResponseDto,
  SessionResponseDto,
} from '../films/dto/film-response.dto';

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {
    super();
  }

  async findAll() {
    const entities = await this.filmRepo.find({
      relations: ['schedule'],
      order: { title: 'ASC' },
    });

    const items = plainToInstance(FilmResponseDto, entities, {
      excludeExtraneousValues: true,
    });

    return { total: items.length, items };
  }

  async findScheduleByFilmId(id: string) {
    const scheduleEntities = await this.scheduleRepo.find({
      where: { film: { id } },
      order: { daytime: 'ASC', hall: 'ASC' },
    });

    const items = plainToInstance(SessionResponseDto, scheduleEntities, {
      excludeExtraneousValues: true,
    });

    return { total: items.length, items };
  }

  async findByIds(filmIds: string[]): Promise<FilmDoc[]> {
    if (!filmIds.length) return [];
    const entities = await this.filmRepo.find({
      where: { id: In(filmIds) },
      relations: ['schedule'],
    });

    return plainToInstance(FilmResponseDto, entities, {
      excludeExtraneousValues: true,
    });
  }

  async reserveSeatsBulk(
    updates: { filmId: string; sessionId: string; tokens: string[] }[],
  ) {
    for (const update of updates) {
      const session = await this.scheduleRepo.findOne({
        where: { id: update.sessionId },
      });
      if (!session) continue;

      session.taken = Array.from(
        new Set([...(session.taken ?? []), ...update.tokens]),
      );
      await this.scheduleRepo.save(session);
    }
  }
}
