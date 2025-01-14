import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

import { OrderEntity, OrderSchema } from './entities/order.entity';
import { OrderItemEntity, OrderItemSchema } from './entities/order.item.entity';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order.item.repository';

@Module({
    providers: [OrderRepository, OrderItemRepository],
    exports: [OrderRepository, OrderItemRepository],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: OrderEntity.name,
                    schema: OrderSchema,
                },
                {
                    name: OrderItemEntity.name,
                    schema: OrderItemSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class OrderRepositoryModule {}
