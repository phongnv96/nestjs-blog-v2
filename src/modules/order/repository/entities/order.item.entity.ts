import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { ProductEntity } from 'src/modules/product/repository/entities/product.entity';

export type OrderItemDoc = OrderItemEntity & Document;

@Schema({ collection: 'order_items' })
export class OrderItemEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ required: true, ref: ProductEntity.name })
    productId: string;

    @Prop({ required: true, type: Number, min: 1 })
    quantity: number;

    @Prop({ required: true, type: Number, min: 0 })
    price: number; // Price per unit

    @Prop({ type: Number, min: 0 })
    discount?: number; // Optional discount
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemEntity);
