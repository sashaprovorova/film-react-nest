import {
  FilmResponseDto,
  SessionResponseDto,
} from '../films/dto/film-response.dto';

export type SessionDoc = SessionResponseDto;
export type FilmDoc = FilmResponseDto;

export abstract class FilmsRepository {
  abstract findAll(): Promise<{ total: number; items: FilmDoc[] }>;
  abstract findScheduleByFilmId(
    id: string,
  ): Promise<{ total: number; items: SessionDoc[] }>;
  abstract findByIds(filmIds: string[]): Promise<FilmDoc[]>;
  abstract reserveSeatsBulk(
    updates: { filmId: string; sessionId: string; tokens: string[] }[],
  ): Promise<void>;
}
