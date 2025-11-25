import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { FilmsRepository, FilmDoc, SessionDoc } from './films.repository';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

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
    const items = await this.filmRepo.find({
      relations: ['schedule'],
      order: { title: 'ASC' },
    });

    return { total: items.length, items: items as unknown as FilmDoc[] };
  }

  async findScheduleByFilmId(id: string) {
    const scheduleEntities = await this.scheduleRepo.find({
      where: { film: { id } },
      order: { daytime: 'ASC', hall: 'ASC' },
    });

    const items: SessionDoc[] = scheduleEntities.map((entity) => ({
      id: entity.id,
      daytime: entity.daytime,
      hall: entity.hall,
      rows: entity.rows,
      seats: entity.seats,
      price: entity.price,
      taken: entity.taken,
    }));

    return { total: items.length, items };
  }

  async findByIds(filmIds: string[]): Promise<FilmDoc[]> {
    if (!filmIds.length) return [];
    const items = await this.filmRepo.find({
      where: { id: In(filmIds) },
      relations: ['schedule'],
    });
    return items as unknown as FilmDoc[];
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
