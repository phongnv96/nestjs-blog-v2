import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepositoryModule } from './respository/category.repository.module';
import { PostRepositoryModule } from '../post/repository/post.repository.module';
import { ProductRepositoryModule } from '../product/repository/product.repository.module';

@Module({
    controllers: [], // Add controllers if needed
    providers: [CategoryService],
    exports: [CategoryService],
    imports: [
        CategoryRepositoryModule,
        forwardRef(() => ProductRepositoryModule),
        forwardRef(() => PostRepositoryModule),
    ],
})
export class CategoryModule {}
