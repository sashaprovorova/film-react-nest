export class TicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
  price?: number;
  daytime?: string;
}

export class CreateOrderDto {
  email?: string;
  phone?: string;
  tickets: TicketDto[];
}

export interface OrderPlacedDto extends TicketDto {
  id: string;
}
