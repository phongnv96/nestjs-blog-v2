import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({
        description: 'ID of the product',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    productId: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 2,
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        description: 'Price per unit',
        example: 29.99,
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Optional discount for the product',
        example: 5.0,
    })
    @IsOptional()
    @IsNumber()
    discount?: number;
}

export class OrderCreateDto {
    @ApiProperty({
        description: 'ID of the user placing the order',
        example: '789e1234-f56b-78d9-a901-234567890abc',
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'Array of items in the order',
        type: [OrderItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({
        description: 'Optional notes for the order',
        example: 'Please deliver between 9 AM - 12 PM',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class OrderUpdateDto {
    @ApiProperty({
        description: 'Payment status of the order',
        example: 'PAID',
        enum: ['PENDING', 'PAID', 'CANCELLED'],
    })
    @IsOptional()
    @IsString()
    paymentStatus?: string;

    @ApiProperty({
        description: 'Optional notes for the order',
        example: 'Change delivery time to afternoon',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class OrderListDto {
    @ApiProperty({
        description: 'Unique identifier of the order',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    readonly id: string;

    @ApiProperty({
        description: 'ID of the user who placed the order',
        example: '789e1234-f56b-78d9-a901-234567890abc',
    })
    @IsString()
    readonly userId: string;

    @ApiProperty({
        description: 'Date the order was placed',
        example: '2023-07-15T10:45:00Z',
    })
    @IsDate()
    readonly orderDate: Date;

    @ApiProperty({
        description: 'Total amount of the order',
        example: 99.99,
    })
    @IsNumber()
    readonly totalAmount: number;

    @ApiProperty({
        description: 'Payment status of the order',
        example: 'PAID',
    })
    @IsString()
    readonly paymentStatus: string;
}
