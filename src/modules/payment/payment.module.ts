import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaypalService } from './services/paypal.service';
import { OrderModule } from '../order/order.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { PaymentAuthController } from './controllers/payment.auth.controller';
import { PaymentRepositoryModule } from './repository/payment.repository.module';

@Module({
    imports: [PaymentRepositoryModule, OrderModule, AuthModule],
    controllers: [PaymentAuthController],
    providers: [PaymentService, PaypalService],
    exports: [PaymentService],
})
export class PaymentModule {}
