import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaymentInitiateResponse {
    @ApiProperty({
        description: 'Payment ID',
        example: '12345-abcde-67890',
    })
    @Type(() => String)
    paymentId: string;
}

export class PaymentCaptureResponse {
    @ApiProperty({
        description: 'Payment status',
        example: 'COMPLETED',
    })
    @Type(() => String)
    status: string;

    @ApiProperty({
        description: 'Transaction ID',
        example: 'txn_123456789',
    })
    @Type(() => String)
    transactionId: string;
}
