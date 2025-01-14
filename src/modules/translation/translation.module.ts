import { Module } from '@nestjs/common';
import { TranslationService } from '../translation/services/translation.service';
import { HelperModule } from 'src/common/helper/helper.module';
import { TranslationRepositoryModule } from './repository/translation.repository.module';

@Module({
    controllers: [],
    providers: [TranslationService],
    exports: [TranslationService],
    imports: [HelperModule, TranslationRepositoryModule],
})
export class TranslationModule {}
