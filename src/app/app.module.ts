import { CommonModule } from 'src/common/common.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { RouterModule } from 'src/router/router.module';

import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AdminModule } from 'src/modules/admin/admin.module';

import('adminjs').then(({ AdminJS }) => {
    import('@adminjs/mongoose').then((mongooseAdapter) => {
        AdminJS.registerAdapter({
            Resource: mongooseAdapter.Resource,
            Database: mongooseAdapter.Database,
        });
    });
});

@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,

        // Jobs
        JobsModule.forRoot(),

        // Routes
        RouterModule.forRoot(),

        AdminModule,
    ],
})
export class AppModule {}
