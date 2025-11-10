import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderPlacedDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import * as crypto from 'crypto';

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

    const group = new Map<
      string,
      {
        film: string;
        session: string;
        tokens: string[];
        rows: number;
        seats: number;
      }
    >();

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
      const groupKey = `${ticket.film}::${ticket.session}`;
      if (!group.has(groupKey)) {
        const session = await this.filmsRepository.findSession(
          ticket.film,
          ticket.session,
        );
        if (!session) throw new NotFoundException('Фильм или сеанс не найден');

        group.set(groupKey, {
          film: ticket.film,
          session: ticket.session,
          tokens: [],
          rows: session.rows ?? 0,
          seats: session.seats ?? 0,
        });
      }
      const sessionGroup = group.get(groupKey)!;

      if (
        ticket.row < 1 ||
        ticket.seat < 1 ||
        ticket.row > sessionGroup.rows ||
        ticket.seat > sessionGroup.seats
      ) {
        throw new BadRequestException({
          message: 'Выбрано некорректное место',
          seat: { row: ticket.row, seat: ticket.seat },
        });
      }

      sessionGroup.tokens.push(`${ticket.row}:${ticket.seat}`);
    }

    for (const { film, session, tokens } of group.values()) {
      const sessionInfo = await this.filmsRepository.findSession(film, session);
      if (!sessionInfo)
        throw new NotFoundException('Фильм или сеанс не найден');

      const takenSet = new Set(sessionInfo.taken ?? []);
      const alreadyTakenSeats = tokens.filter((seatToken) =>
        takenSet.has(seatToken),
      );
      if (alreadyTakenSeats.length) {
        throw new BadRequestException({
          message: 'Некоторые места уже заняты',
          seats: alreadyTakenSeats,
        });
      }
      await this.filmsRepository.reserveSeats(film, session, tokens);
    }
    const items: OrderPlacedDto[] = tickets.map((ticket) => ({
      ...ticket,
      id: crypto.randomUUID(),
    }));

    return { total: items.length, items };
  }
}
