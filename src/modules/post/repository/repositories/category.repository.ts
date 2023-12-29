import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CategoryEntity, CategoryDoc } from '../entities/category.entity';


@Injectable()
export class CategoryRepository extends DatabaseMongoUUIDRepositoryAbstract<
    CategoryEntity,
    CategoryDoc
> {
    constructor(
        @DatabaseModel(CategoryEntity.name)
        private readonly CategoryModel: Model<CategoryEntity>
    ) {
        super(CategoryModel);
    }
}
