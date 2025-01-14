import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';

export type OrderDoc = OrderEntity & Document;

@Schema({ collection: 'orders' })
export class OrderEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ required: true, type: String })
    userId: string; // ID of the user who placed the order

    @Prop({ required: true, type: Date, default: Date.now })
    orderDate: Date;

    @Prop({ required: true, type: Number, default: 0 })
    totalAmount: number;

    @Prop({
        required: true,
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: 'PENDING',
    })
    paymentStatus: string;

    @Prop({ type: [String], ref: 'OrderItemEntity' })
    items: string[]; // List of order item IDs

    @Prop({ type: String })
    notes?: string; // Optional notes for the order
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
