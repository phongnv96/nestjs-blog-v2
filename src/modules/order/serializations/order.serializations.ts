import { ApiProperty } from '@nestjs/swagger';

export class OrderItemSerialization {
    @ApiProperty({
        description: 'ID of the product',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly productId: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 2,
    })
    readonly quantity: number;

    @ApiProperty({
        description: 'Price per unit',
        example: 29.99,
    })
    readonly price: number;

    @ApiProperty({
        description: 'Optional discount for the product',
        example: 5.0,
    })
    readonly discount?: number;
}

export class OrderGetSerialization {
    @ApiProperty({
        description: 'Unique identifier of the order',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly id: string;

    @ApiProperty({
        description: 'ID of the user who placed the order',
        example: '789e1234-f56b-78d9-a901-234567890abc',
    })
    readonly userId: string;

    @ApiProperty({
        description: 'Date the order was placed',
        example: '2023-07-15T10:45:00Z',
    })
    readonly orderDate: Date;

    @ApiProperty({
        description: 'Total amount of the order',
        example: 99.99,
    })
    readonly totalAmount: number;

    @ApiProperty({
        description: 'Payment status of the order',
        example: 'PAID',
    })
    readonly paymentStatus: string;

    @ApiProperty({
        description: 'Array of items in the order',
        type: [OrderItemSerialization],
    })
    readonly items: OrderItemSerialization[];

    @ApiProperty({
        description: 'Optional notes for the order',
        example: 'Please deliver between 9 AM - 12 PM',
    })
    readonly notes?: string;
}

export class OrderListSerialization {
    @ApiProperty({
        description: 'Unique identifier of the order',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly id: string;

    @ApiProperty({
        description: 'ID of the user who placed the order',
        example: '789e1234-f56b-78d9-a901-234567890abc',
    })
    readonly userId: string;

    @ApiProperty({
        description: 'Date the order was placed',
        example: '2023-07-15T10:45:00Z',
    })
    readonly orderDate: Date;

    @ApiProperty({
        description: 'Total amount of the order',
        example: 99.99,
    })
    readonly totalAmount: number;

    @ApiProperty({
        description: 'Payment status of the order',
        example: 'PAID',
    })
    readonly paymentStatus: string;
}
