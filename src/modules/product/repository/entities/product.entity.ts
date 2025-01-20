import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { TranslationEntity } from '../../../translation/repository/entities/translation.entity';
import { CategoryEntity } from 'src/modules/category/respository/entities/category.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ProductRatingEntity } from './product-rating.entity';

export const ProductDatabaseName = 'products';

@DatabaseEntity({ collection: ProductDatabaseName })
export class ProductEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: true,
        type: String,
        maxlength: 255,
    })
    name: string;

    @Prop({
        required: true,
        type: String,
    })
    description: string;

    @Prop({
        required: true,
        type: Number,
        min: 0,
    })
    price: number;

    @Prop({
        required: true,
        type: Boolean,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: true,
        type: String,
        enum: ['SOFTWARE', 'EBOOK', 'VIDEO', 'AUDIO', 'COURSE', 'OTHER'],
    })
    type: string;

    @Prop({
        required: true,
        ref: CategoryEntity.name,
        index: true,
        type: [String],
    })
    categories: string[];

    @Prop({
        type: AwsS3Serialization,
    })
    downloadUrl: AwsS3Serialization;

    @Prop({
        type: [AwsS3Serialization],
    })
    images: AwsS3Serialization[];

    @Prop({
        type: Number,
        default: 0,
    })
    downloads: number;

    @Prop({
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    })
    rating: number;

    @Prop({
        type: String,
    })
    version: string;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: ProductRatingEntity.name,
            },
        ],
    })
    ratings: Types.ObjectId[];

    @Prop({
        type: Number,
        default: 0,
    })
    ratingCount: number;

    @Prop({
        type: Number,
        default: 0,
    })
    commentCount: number;

    @Prop({
        required: true,
        type: [{ type: Types.ObjectId, ref: TranslationEntity.name }],
    })
    translations: Types.ObjectId[];

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    author: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);

export type ProductDoc = ProductEntity & Document;
