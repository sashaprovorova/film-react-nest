import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type FilmDoc = {
  id: string;
  schedule?: Array<{
    id: string;
    daytime?: Date;
    hall?: number;
    rows?: number;
    seats?: number;
    price?: number;
    taken?: string[];
  }>;
};

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel('Film') private readonly filmModel: Model<FilmDoc>,
  ) {}
  async findAll() {
    const items = await this.filmModel.find({}, { _id: 0 }).lean();
    return { total: items.length, items };
  }
  async findScheduleByFilmId(id: string) {
    const doc = await this.filmModel
      .findOne({ id }, { _id: 0, schedule: 1 })
      .lean();

    return { total: doc?.schedule?.length ?? 0, items: doc?.schedule ?? [] };
  }
  async findSession(filmId: string, sessionId: string) {
    const doc = await this.filmModel
      .findOne(
        { id: filmId, 'schedule.id': sessionId },
        { _id: 0, 'schedule.$': 1 },
      )
      .lean();
    return doc?.schedule?.[0];
  }
  async reserveSeats(filmId: string, sessionId: string, tokens: string[]) {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $addToSet: { 'schedule.$.taken': { $each: tokens } } },
    );
  }
}
