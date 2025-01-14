import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    ProductRatingEntity,
    ProductRatingDoc,
} from './entities/product-rating.entity';

@Injectable()
export class ProductRatingRepository extends DatabaseMongoUUIDRepositoryAbstract<
    ProductRatingEntity,
    ProductRatingDoc
> {
    constructor(
        @DatabaseModel(ProductRatingEntity.name)
        private readonly productRatingModel: Model<ProductRatingEntity>
    ) {
        super(productRatingModel);
    }

    // Additional methods for custom queries if needed
    async findRatingsByProduct(productId: string): Promise<ProductRatingDoc[]> {
        return this.productRatingModel.find({ productId }).exec();
    }

    async getAverageRating(productId: string): Promise<number> {
        const ratings = await this.productRatingModel
            .find({ productId })
            .exec();
        if (!ratings.length) return 0;
        return (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
        );
    }
}
