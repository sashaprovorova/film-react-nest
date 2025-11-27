import { Expose, Type } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  id: string;

  @Expose()
  daytime: Date;

  @Expose()
  hall: number;

  @Expose()
  rows: number;

  @Expose()
  seats: number;

  @Expose()
  price: number;

  @Expose()
  taken: string[];
}

export class FilmResponseDto {
  @Expose()
  id: string;

  @Expose()
  rating: number;

  @Expose()
  director: string;

  @Expose()
  tags: string[];

  @Expose()
  image: string;

  @Expose()
  cover: string;

  @Expose()
  title: string;

  @Expose()
  about: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => SessionResponseDto)
  schedule: SessionResponseDto[];
}
