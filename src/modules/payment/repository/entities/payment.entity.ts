import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { Document } from 'mongoose';

export type PaymentDoc = PaymentEntity & Document;

@Schema({ collection: 'payments' })
export class PaymentEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ required: true, type: String })
    orderId: string;

    @Prop({ required: true, type: String })
    userId: string;

    @Prop({ required: true, type: Number })
    amount: number;

    @Prop({
        required: true,
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING',
    })
    status: string;

    @Prop({ required: true, type: String })
    paymentMethod: string;

    @Prop({ type: String })
    transactionId?: string;

    @Prop({ type: Date })
    paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentEntity);
