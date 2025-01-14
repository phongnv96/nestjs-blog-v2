import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ProductDoc, ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductRepository extends DatabaseMongoUUIDRepositoryAbstract<
    ProductEntity,
    ProductDoc
> {
    constructor(
        @DatabaseModel(ProductEntity.name)
        private readonly productModel: Model<ProductEntity>
    ) {
        super(productModel, [{ path: 'categories' }]);
    }
    async updateRating(
        productId: string,
        avgRating: number,
        ratingCount: number
    ): Promise<void> {
        await this.productModel
            .updateOne(
                { _id: productId },
                {
                    rating: avgRating,
                    ratingCount: ratingCount,
                }
            )
            .exec();
    }
}
