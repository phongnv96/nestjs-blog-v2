import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PostDoc, PostEntity } from '../entities/post.entity';

@Injectable()
export class PostRepository extends DatabaseMongoUUIDRepositoryAbstract<
    PostEntity,
    PostDoc
> {
    constructor(
        @DatabaseModel(PostEntity.name)
        private readonly postModel: Model<PostEntity>
    ) {
        super(postModel, [
            {path: 'translations'},
            {path: 'author'}
        ]);
    }
    getModel = () => this.postModel
}
