import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { CategoryEntity } from 'src/modules/category/respository/entities/category.entity';
import { TranslationEntity } from 'src/modules/translation/repository/entities/translation.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export const PostDatabaseName = 'posts';

@DatabaseEntity({ collection: PostDatabaseName })
export class PostEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ default: 0 })
    views: number;

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
    })
    author: string;

    @Prop({ type: [String] })
    tags: string[];

    @Prop({
        required: false,
        type: [
            {
                author: String,
                clap: Number,
            },
        ],
    })
    claps?: {
        author: string;
        clap: number;
    }[];

    @Prop()
    thumbnail: string;

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

    @Prop({
        required: true,
        ref: TranslationEntity.name,
        index: true,
        type: [String],
    })
    translations: string[];

    @Prop({
        required: true,
        ref: CategoryEntity.name,
        index: true,
        type: [String],
    })
    categories: string[];
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);

export type PostDoc = PostEntity & Document;
