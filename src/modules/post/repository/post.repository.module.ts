import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

import { PostRepository } from './repositories/post.repository';
import { PostEntity, PostSchema } from './entities/post.entity';
import {
    TranslationEntity,
    TranslationSchema,
} from './entities/translation.entity';
import { TranslationRepository } from './repositories/translation.repository';
import { HelperModule } from 'src/common/helper/helper.module';
import { ViewRepository } from './repositories/view.repository';
import { ViewEntity, ViewSchema } from './entities/view.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryEntity, CategorySchema } from './entities/category.entity';

@Module({
    providers: [
        PostRepository,
        TranslationRepository,
        ViewRepository,
        CategoryRepository,
    ],
    exports: [
        PostRepository,
        TranslationRepository,
        ViewRepository,
        CategoryRepository,
    ],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: PostEntity.name,
                    schema: PostSchema,
                },
                {
                    name: TranslationEntity.name,
                    schema: TranslationSchema,
                },
                {
                    name: ViewEntity.name,
                    schema: ViewSchema,
                },
                {
                    name: CategoryEntity.name,
                    schema: CategorySchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HelperModule,
    ],
})
export class PostRepositoryModule {}
