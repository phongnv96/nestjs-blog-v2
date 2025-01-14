import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentEntity, PaymentSchema } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: PaymentEntity.name,
                    schema: PaymentSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    providers: [PaymentRepository],

    exports: [PaymentRepository],
})
export class PaymentRepositoryModule {}
