import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from '../../order/dtos/order.dto';

export class DirectPaymentDto {
    @ApiProperty({
        description: 'Array of items to purchase',
        type: [OrderItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
