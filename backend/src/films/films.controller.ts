import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmIdParamDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  list() {
    return this.filmsService.list();
  }
  @Get(':id/schedule')
  schedule(@Param() params: FilmIdParamDto) {
    return this.filmsService.schedule(params.id);
  }
}
