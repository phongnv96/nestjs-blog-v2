import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CommentDoc, CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends DatabaseMongoUUIDRepositoryAbstract<
    CommentEntity,
    CommentDoc
> {
    constructor(
        @DatabaseModel(CommentEntity.name)
        private readonly CommentModel: Model<CommentEntity>
    ) {
        super(CommentModel);
    }
}
