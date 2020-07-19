import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Query, ParseIntPipe, Param, Delete } from '@nestjs/common';

import { AuthRequired } from 'modules/common/guards/token';
import { enRoles } from 'modules/database/interfaces/user';
import { OrderRepository } from '../repositories/order';
import { OrderService } from '../services/order';
import { Order } from 'modules/database/models/order';
import { SaveValidator } from 'modules/admin/validators/order/save';
import { ListValidator } from 'modules/admin/validators/order/list';

@ApiTags('Admin: Order')
@Controller('/order')
@AuthRequired([enRoles.admin])
export class OrderController {
  constructor(private orderRepository: OrderRepository, private orderService: OrderService) {}

  @Post()
  @ApiResponse({ status: 200, type: Order })
  public async save(@Body() model: SaveValidator) {
    return this.orderService.save(model);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Order] })
  public async list(@Query() query: ListValidator) {
    return this.orderRepository.list(query);
  }

  @Get(':orderId')
  @ApiResponse({ status: 200, type: Order })
  public async details(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderRepository.findById(orderId);
  }

  @Delete(':orderId')
  public async delete(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.remove(orderId);
  }
}
