export type SessionDoc = {
  id: string;
  daytime?: Date;
  hall?: number;
  rows?: number;
  seats?: number;
  price?: number;
  taken?: string[];
};

export type FilmDoc = {
  id: string;
  schedule?: SessionDoc[];
  [key: string]: any;
};

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
