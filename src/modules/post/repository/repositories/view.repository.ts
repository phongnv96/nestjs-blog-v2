import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ViewDoc, ViewEntity } from '../entities/view.entity';

@Injectable()
export class ViewRepository extends DatabaseMongoUUIDRepositoryAbstract<
    ViewEntity,
    ViewDoc
> {
    constructor(
        @DatabaseModel(ViewEntity.name)
        private readonly ViewModel: Model<ViewEntity>
    ) {
        super(ViewModel);
    }
}
