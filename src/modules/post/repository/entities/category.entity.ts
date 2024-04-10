import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IsString } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export const CategoryDatabaseName = 'categories';

@DatabaseEntity({ collection: CategoryDatabaseName })
export class CategoryEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        index: true,
        trim: true,
        type: String,
    })
    @IsString()
    path: string;

    @Prop({
        index: true,
        trim: true,
        type: String,
        required: true,
    })
    @IsString()
    title: string;

    @Prop({
        index: true,
        trim: true,
        type: String,
    })
    @IsString()
    slug: string;

    @Prop({
        index: true,
        trim: true,
        type: String,
        required: true,
    })
    @IsString()
    description: string;

    @Prop({
        ref: CategoryEntity.name,
        index: true,
        required: false,
    })
    parentId: string;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: AwsS3Serialization;


}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);

export type CategoryDoc = CategoryEntity & Document;
