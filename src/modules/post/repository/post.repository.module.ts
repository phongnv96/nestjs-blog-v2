import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

import { PostRepository } from './repositories/post.repository';
import { PostEntity, PostSchema } from './entities/post.entity';
import { HelperModule } from 'src/common/helper/helper.module';
import { ViewRepository } from './repositories/view.repository';
import { ViewEntity, ViewSchema } from './entities/view.entity';

@Module({
    providers: [PostRepository, ViewRepository],
    exports: [PostRepository, ViewRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: PostEntity.name,
                    schema: PostSchema,
                },
                {
                    name: ViewEntity.name,
                    schema: ViewSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HelperModule,
    ],
})
export class PostRepositoryModule {}
