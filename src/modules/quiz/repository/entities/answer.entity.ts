import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IsString } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { QuestionEntity } from './question.entity';
import { boolean } from 'joi';

export const AnswerDatabaseName = 'categories';

@DatabaseEntity({ collection: AnswerDatabaseName })
export class AnswerEntity extends DatabaseMongoUUIDEntityAbstract {
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
        required: true,
    })
    @IsString()
    description: string;

    @Prop({
        index: true,
        trim: true,
        type: String,
        required: true,
    })
    @IsString()
    answer: string;

    @Prop({
        index: true,
        type: boolean,
        default(val: any): any {
            return false;
        },
        required: true,
    })
    @IsString()
    isCorrect: boolean;

    @Prop({
        ref: QuestionEntity.name,
        index: true,
        required: false,
    })
    questionId: string;

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

export const AnswerSchema = SchemaFactory.createForClass(AnswerEntity);

export type AnswerDoc = AnswerEntity & Document;
