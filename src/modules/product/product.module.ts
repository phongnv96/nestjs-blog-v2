import { forwardRef, Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repository/product.repository.module';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';
import { TranslationModule } from '../translation/translation.module';

@Module({
    controllers: [], // Add controllers if needed
    providers: [ProductService],
    exports: [ProductService],
    imports: [
        ProductRepositoryModule,
        TranslationModule,
        forwardRef(() => CategoryModule),
    ],
})
export class ProductModule {}
