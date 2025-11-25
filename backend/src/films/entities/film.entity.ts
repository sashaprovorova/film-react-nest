import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'real' })
  rating: number;

  @Column({ type: 'text' })
  director: string;

  @Column({ type: 'text', array: true })
  tags: string[];

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  cover: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, {
    cascade: true,
  })
  schedule: Schedule[];
}
