import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CategoryDoc, CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends DatabaseMongoUUIDRepositoryAbstract<
    CategoryEntity,
    CategoryDoc
> {
    constructor(
        @DatabaseModel(CategoryEntity.name)
        private readonly categoryModel: Model<CategoryEntity>
    ) {
        super(categoryModel);
    }

    getModel = (): Model<CategoryEntity> => this.categoryModel;

    // Additional methods for custom queries if needed
}
