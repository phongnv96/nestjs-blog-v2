import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';

export type ProductRatingDoc = ProductRatingEntity & Document;

@Schema({ collection: 'product_ratings' })
export class ProductRatingEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: true,
        type: String,
        index: true,
    })
    productId: string;

    @Prop({
        required: true,
        type: String,
        index: true,
    })
    userId: string;

    @Prop({
        required: true,
        type: Number,
        min: 1,
        max: 5,
    })
    rating: number;

    @Prop({
        type: String,
        maxlength: 500,
    })
    review: string;
}

export const ProductRatingSchema =
    SchemaFactory.createForClass(ProductRatingEntity);
