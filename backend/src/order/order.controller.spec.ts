import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.create() должен вызывать OrderService.create и возвращать результат', async () => {
    const dto: CreateOrderDto = {
      tickets: [{ film: 'f1', session: 's1', row: 1, seat: 1 }],
    };
    const expectedResult = {
      total: 1,
      items: [{ ...dto.tickets[0], id: 'uuid' }],
    };
    orderServiceMock.create.mockResolvedValue(expectedResult);
    const result = await controller.create(dto);
    expect(orderServiceMock.create).toHaveBeenCalledTimes(1);
    expect(orderServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedResult);
  });
});
