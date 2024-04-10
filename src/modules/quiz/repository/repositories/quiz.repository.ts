import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { QuizEntity, QuizDoc } from '../entities/quiz.entity';

@Injectable()
export class QuizRepository extends DatabaseMongoUUIDRepositoryAbstract<
    QuizEntity,
    QuizDoc
> {
    constructor(
        @DatabaseModel(QuizEntity.name)
        private readonly QuizModel: Model<QuizEntity>
    ) {
        super(QuizModel);
    }
}
