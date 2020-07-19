//import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IOrder } from 'modules/database/interfaces/order';

import { OrderRepository } from '../repositories/order';
import { OrderService } from './order';

/* eslint-disable max-len */
describe('Admin/OrderService', () => {
  let orderRepository: OrderRepository;
  let service: OrderService;

  const order: IOrder = {
    description: 'Order to Test',
    quantity: 10,
    value: 100
  };

  beforeEach(async () => {
    orderRepository = new OrderRepository();
    service = new OrderService(orderRepository);
  });

  it('should create a order', async () => {
    const result = await service.save(order);

    expect(result).toBe(order);
  });
});
