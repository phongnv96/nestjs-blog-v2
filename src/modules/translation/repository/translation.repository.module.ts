import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { MongooseModule } from '@nestjs/mongoose';
import {
    TranslationEntity,
    TranslationSchema,
} from './entities/translation.entity';
import { TranslationRepository } from './repositories/translation.repository';
import { TranslationService } from '../services/translation.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: TranslationEntity.name,
                    schema: TranslationSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    providers: [TranslationRepository, TranslationService],
    exports: [TranslationRepository, TranslationService],
})
export class TranslationRepositoryModule {}
