import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { OrderEntity, OrderDoc } from './entities/order.entity';

@Injectable()
export class OrderRepository extends DatabaseMongoUUIDRepositoryAbstract<
    OrderEntity,
    OrderDoc
> {
    constructor(
        @DatabaseModel(OrderEntity.name)
        private readonly orderModel: Model<OrderEntity>
    ) {
        super(orderModel, []);
    }
}
