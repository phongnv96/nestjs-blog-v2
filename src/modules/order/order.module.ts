import { Module } from '@nestjs/common';
import { OrderRepositoryModule } from './repository/order.repository.module';
import { OrderService } from './services/order.service';

@Module({
    controllers: [], // Add controllers if needed
    providers: [OrderService],
    exports: [OrderService],
    imports: [OrderRepositoryModule],
})
export class OrderModule {}
