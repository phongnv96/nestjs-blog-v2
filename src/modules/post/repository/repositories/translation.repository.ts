import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { TranslationEntity, TranslationDoc } from '../entities/translation.entity';

@Injectable()
export class TranslationRepository extends DatabaseMongoUUIDRepositoryAbstract<
    TranslationEntity,
    TranslationDoc
> {
    constructor(
        @DatabaseModel(TranslationEntity.name)
        private readonly TranslationModel: Model<TranslationEntity>
    ) {
        super(TranslationModel);
    }
}
