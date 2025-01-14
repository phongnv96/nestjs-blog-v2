import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

import { ProductEntity, ProductSchema } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import {
    ProductRatingEntity,
    ProductRatingSchema,
} from './entities/product-rating.entity';
import { ProductRatingRepository } from './product.rating.repository';

@Module({
    providers: [ProductRepository, ProductRatingRepository],
    exports: [ProductRepository, ProductRatingRepository],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ProductEntity.name,
                    schema: ProductSchema,
                },
                {
                    name: ProductRatingEntity.name,
                    schema: ProductRatingSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class ProductRepositoryModule {}
