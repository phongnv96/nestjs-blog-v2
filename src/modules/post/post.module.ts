import { forwardRef, Module } from '@nestjs/common';
import { PostRepositoryModule } from './repository/post.repository.module';
import { PostService } from './services/post.service';
import { UserRepositoryModule } from '../user/repository/user.repository.module';
import { TranslationService } from '../translation/services/translation.service';
import { ViewService } from './services/view.service';
import { TranslationRepositoryModule } from '../translation/repository/translation.repository.module';
import { CategoryModule } from '../category/category.module';

@Module({
    controllers: [],
    providers: [PostService, TranslationService, ViewService],
    exports: [PostService, TranslationService, ViewService],
    imports: [
        PostRepositoryModule,
        UserRepositoryModule,
        TranslationRepositoryModule,
        forwardRef(() => CategoryModule),
    ],
})
export class PostModule {}
