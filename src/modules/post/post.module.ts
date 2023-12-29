import { Module } from '@nestjs/common';
import { PostRepositoryModule } from './repository/post.repository.module';
import { PostService } from './services/post.service';
import { UserRepositoryModule } from '../user/repository/user.repository.module';
import { TranslationService } from './services/translation.service';
import { ViewService } from './services/view.service';
import { CategoryService } from './services/category.service';

@Module({
    controllers: [],
    providers: [PostService, TranslationService, ViewService, CategoryService],
    exports: [PostService, TranslationService, ViewService, CategoryService],
    imports: [PostRepositoryModule, UserRepositoryModule],
})
export class PostModule {}
