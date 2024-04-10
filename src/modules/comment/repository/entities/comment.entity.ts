import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { PostEntity } from '../../../post/repository/entities/post.entity';

export const CommentDatabaseName = 'comments';

@DatabaseEntity({ collection: CommentDatabaseName })
export class CommentEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ default: 0 })
    views: number;

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
        isArray: true,
    })
    likes: string[];

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
        isArray: true,
    })
    hearts: string[];

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
    })
    author: string;

    @Prop({ default: 0 })
    left: number;

    @Prop({ default: 0 })
    right: number;

    @Prop()
    thumbnail: string;

    @Prop({
        required: true,
        index: true,
    })
    content: string;

    @Prop({
        required: false,
        _id: false,
        type: [
            {
                path: String,
                pathWithFilename: String,
                filename: String,
                completedUrl: String,
                baseUrl: String,
                mime: String,
            },
        ],
        isArray: true,
    })
    photo?: AwsS3Serialization[];

    @Prop({
        required: true,
        ref: PostEntity.name,
        index: true,
        type: String,
    })
    post: string;

    @Prop({
        index: true,
    })
    parentId?: string;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

export type CommentDoc = CommentEntity & Document;
