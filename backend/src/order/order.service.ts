import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderPlacedDto } from './dto/order.dto';
import { FilmDoc, FilmsRepository } from '../repository/films.repository';
import * as crypto from 'crypto';

type SessionSeat = { row: number; seat: number };

type SessionGroup = {
  filmId: string;
  sessionId: string;
  seats: SessionSeat[];
};

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto) {
    const { tickets } = dto;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw new BadRequestException(
        'При оформлении заказа должен быть указан хотя бы один билет',
      );
    }

    const groups = new Map<string, SessionGroup>();
    const filmIdsSet = new Set<string>();

    for (const ticket of tickets) {
      if (
        !ticket.film ||
        !ticket.session ||
        ticket.row == null ||
        ticket.seat == null
      ) {
        throw new BadRequestException(
          'Для каждого билета должен быть выбран фильм, место и ряд',
        );
      }
      filmIdsSet.add(ticket.film);

      const groupKey = `${ticket.film}::${ticket.session}`;
      let group = groups.get(groupKey);
      if (!group) {
        group = {
          filmId: ticket.film,
          sessionId: ticket.session,
          seats: [],
        };
        groups.set(groupKey, group);
      }

      group.seats.push({ row: ticket.row, seat: ticket.seat });
    }

    const filmIds = Array.from(filmIdsSet);
    const films = await this.filmsRepository.findByIds(filmIds);
    const filmMap = new Map<string, FilmDoc>(
      films.map((film) => [film.id, film]),
    );

    const seatUpdates: {
      filmId: string;
      sessionId: string;
      tokens: string[];
    }[] = [];

    for (const group of groups.values()) {
      const film = filmMap.get(group.filmId);
      if (!film) {
        throw new NotFoundException('Фильм или сеанс не найден');
      }

      const session = film.schedule?.find(
        (scheduleItem) => scheduleItem.id === group.sessionId,
      );
      if (!session) {
        throw new NotFoundException('Фильм или сеанс не найден');
      }
      const maxRows = session.rows ?? 0;
      const maxSeats = session.seats ?? 0;

      const tokens: string[] = [];
      const tokensInGroup = new Set<string>();

      for (const { row, seat } of group.seats) {
        if (row < 1 || seat < 1 || row > maxRows || seat > maxSeats) {
          throw new BadRequestException({
            message: 'Выбрано некорректное место',
            seat: { row, seat },
          });
        }

        const token = `${row}:${seat}`;

        if (tokensInGroup.has(token)) {
          throw new BadRequestException({
            message: 'Некоторые места в заказе повторяются',
            seats: [token],
          });
        }

        tokensInGroup.add(token);
        tokens.push(token);
      }

      const takenSet = new Set(session.taken ?? []);
      const alreadyTakenSeats = tokens.filter((token) => takenSet.has(token));

      if (alreadyTakenSeats.length) {
        throw new BadRequestException({
          message: 'Некоторые места уже заняты',
          seats: alreadyTakenSeats,
        });
      }

      seatUpdates.push({
        filmId: group.filmId,
        sessionId: group.sessionId,
        tokens,
      });
    }

    await this.filmsRepository.reserveSeatsBulk(seatUpdates);

    const items: OrderPlacedDto[] = tickets.map((ticket) => ({
      ...ticket,
      id: crypto.randomUUID(),
    }));

    return { total: items.length, items };
  }
}
