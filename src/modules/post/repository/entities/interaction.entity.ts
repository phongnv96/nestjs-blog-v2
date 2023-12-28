import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export const InteractionDatabaseName = 'Interactions';

export enum ReactionType {
    Heart = 'heart',
    Sad = 'sad',
    Happy = 'happy',
}

@DatabaseEntity({ collection: InteractionDatabaseName })
export class InteractionEntity extends DatabaseMongoUUIDEntityAbstract {

    @Prop({ type: String, enum: Object.values(ReactionType) })
    action: string;

    @Prop({
        ref: PostEntity.name,
        index: true,
    })
    postId: string;

    @Prop({
        ref: UserEntity.name,
        index: true,
    })
    userId: string;
}

export const InteractionSchema = SchemaFactory.createForClass(InteractionEntity);

export type InteractionDoc = InteractionEntity & Document;
