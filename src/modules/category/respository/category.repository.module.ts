import { Module } from '@nestjs/common';
import { CategoryEntity, CategorySchema } from './entities/category.entity';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryRepository } from './category.repository';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CategoryEntity.name,
                    schema: CategorySchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HelperModule,
    ],
    providers: [CategoryRepository],
    exports: [CategoryRepository],
})
export class CategoryRepositoryModule {}
