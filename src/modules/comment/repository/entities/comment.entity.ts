import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { ENUM_COMMENT_REFERENCE_TYPE } from '../../constants/comment.enum.constant';

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
        index: true,
    })
    parentId?: string;

    @Prop({
        required: true,
        discriminatorKey: 'referenceType',
        refPath: 'referenceType',
        type: Types.ObjectId,
    })
    reference: Types.ObjectId;

    @Prop({
        required: true,
        enum: ENUM_COMMENT_REFERENCE_TYPE,
        type: String,
    })
    referenceType: ENUM_COMMENT_REFERENCE_TYPE;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

// Add compound index for better query performance
CommentSchema.index({ reference: 1, referenceType: 1 });
// Add index for nested set model queries
CommentSchema.index({ left: 1, right: 1 });

export type CommentDoc = CommentEntity & Document;
