import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: FilmsRepository) {}
  list() {
    return this.repository.findAll();
  }
  schedule(id: string) {
    return this.repository.findScheduleByFilmId(id);
  }
}
