import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export const ViewDatabaseName = 'Views';

@DatabaseEntity({ collection: ViewDatabaseName })
export class ViewEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        index: true,
        trim: true,
        type: String,
    })
    ipAddress: string;

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

export const ViewSchema = SchemaFactory.createForClass(ViewEntity);

export type ViewDoc = ViewEntity & Document;
