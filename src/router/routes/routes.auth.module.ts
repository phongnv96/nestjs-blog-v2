import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { CategoryAuthController } from 'src/modules/post/controllers/category.auth.controller';
import { PostAuthController } from 'src/modules/post/controllers/post.auth.controller';
import { PostModule } from 'src/modules/post/post.module';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { GCPModule } from '../../common/gcp/gcp.module';

@Module({
    controllers: [
        UserAuthController,
        PostAuthController,
        CategoryAuthController,
    ],
    providers: [],
    exports: [],
    imports: [UserModule, AuthModule, AwsModule, PostModule, GCPModule],
})
export class RoutesAuthModule {}
