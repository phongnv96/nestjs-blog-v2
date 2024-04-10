import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { AnswerDoc, AnswerEntity } from '../entities/answer.entity';

@Injectable()
export class AnswerRepository extends DatabaseMongoUUIDRepositoryAbstract<
    AnswerEntity,
    AnswerDoc
> {
    constructor(
        @DatabaseModel(AnswerEntity.name)
        private readonly AnswerModel: Model<AnswerEntity>
    ) {
        super(AnswerModel);
    }
}
