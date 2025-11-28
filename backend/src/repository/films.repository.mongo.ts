import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmsRepository, FilmDoc } from './films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel('Film')
    private readonly filmModel: Model<FilmDoc>,
  ) {
    super();
  }

  async findAll() {
    const items = await this.filmModel.find({}, { _id: 0 }).lean();
    return { total: items.length, items };
  }

  async findScheduleByFilmId(id: string) {
    const doc = await this.filmModel
      .findOne({ id }, { _id: 0, schedule: 1 })
      .lean();

    const schedule = doc?.schedule ?? [];
    return { total: schedule.length, items: schedule };
  }

  async findByIds(filmIds: string[]): Promise<FilmDoc[]> {
    return this.filmModel
      .find({ id: { $in: filmIds } }, { _id: 0 })
      .lean()
      .exec();
  }

  async reserveSeatsBulk(
    updates: { filmId: string; sessionId: string; tokens: string[] }[],
  ) {
    if (!updates.length) return;

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { id: update.filmId, 'schedule.id': update.sessionId },
        update: { $addToSet: { 'schedule.$.taken': { $each: update.tokens } } },
      },
    }));

    await this.filmModel.bulkWrite(bulkOps);
  }
}
