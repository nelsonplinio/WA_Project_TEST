import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsNumber,
  IsPositive
} from 'class-validator';

import { IOrder } from 'modules/database/interfaces/order';

export class SaveValidator implements IOrder {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(250)
  @ApiProperty({ required: true, type: 'string', minLength: 3, maxLength: 250 })
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: true, type: 'double' })
  public value: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty({ required: true, type: 'integer' })
  public quantity: number;
}
