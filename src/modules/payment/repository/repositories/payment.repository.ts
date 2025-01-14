import { Injectable } from '@nestjs/common';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { Model } from 'mongoose';
import { PaymentDoc, PaymentEntity } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository extends DatabaseMongoUUIDRepositoryAbstract<
    PaymentEntity,
    PaymentDoc
> {
    constructor(
        @DatabaseModel(PaymentEntity.name)
        private readonly paymentModel: Model<PaymentEntity>
    ) {
        super(paymentModel);
    }
}
