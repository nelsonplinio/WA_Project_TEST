import { Model } from 'objection';
import { ApiProperty } from '@nestjs/swagger';

import { IOrder } from '../interfaces/order';

export class Order extends Model implements IOrder {
  @ApiProperty({ type: 'integer' })
  public id: number;

  @ApiProperty({ type: 'string' })
  public description: string;

  @ApiProperty({ type: 'double' })
  public value: number;

  @ApiProperty({ type: 'integer' })
  public quantity: number;

  @ApiProperty({ type: 'double' })
  public get total(): number {
    return this.quantity * this.value;
  }

  public static get tableName(): string {
    return 'Order';
  }

  public static get virtualAttributes(): string[] {
    return ['total'];
  }
}
