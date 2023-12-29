import { CommonModule } from 'src/common/common.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { RouterModule } from 'src/router/router.module';

import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';

@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,

        // Jobs
        JobsModule.forRoot(),

        // Routes
        RouterModule.forRoot(),
    ],
})
export class AppModule {}
