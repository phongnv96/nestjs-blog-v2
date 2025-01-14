import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { OrderItemEntity, OrderItemDoc } from './entities/order.item.entity';

@Injectable()
export class OrderItemRepository extends DatabaseMongoUUIDRepositoryAbstract<
    OrderItemEntity,
    OrderItemDoc
> {
    constructor(
        @DatabaseModel(OrderItemEntity.name)
        private readonly orderItemModel: Model<OrderItemEntity>
    ) {
        super(orderItemModel, []);
    }
}
