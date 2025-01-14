import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/common/auth/auth.module';
import { HealthModule } from 'src/health/health.module';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { MessagePublicController } from 'src/common/message/controllers/message.public.controller';
import { SettingPublicController } from 'src/common/setting/controllers/setting.public.controller';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { PostModule } from 'src/modules/post/post.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { PostPublicController } from 'src/modules/post/controllers/post.public.controller';
import { CommentPublicController } from '../../modules/comment/controllers/comment.public.controller';
import { CommentModule } from '../../modules/comment/comment.module';
import { GCPModule } from '../../common/gcp/gcp.module';
import { MailModule } from '../../common/mail/mail.module';
import { ProductPublicController } from 'src/modules/product/controllers/product.public.controller';
import { ProductModule } from 'src/modules/product/product.module';
import { TranslationModule } from '../../modules/translation/translation.module';
import { CategoryPublicController } from 'src/modules/category/controllers/category.public.controller';
import { CategoryModule } from 'src/modules/category/category.module';

@Module({
    controllers: [
        HealthPublicController,
        MessagePublicController,
        SettingPublicController,
        UserPublicController,
        PostPublicController,
        CategoryPublicController,
        ProductPublicController,
        CommentPublicController,
    ],
    providers: [],
    exports: [],
    imports: [
        TerminusModule,
        HealthModule,
        UserModule,
        AuthModule,
        RoleModule,
        PostModule,
        ProductModule,
        AwsModule,
        CommentModule,
        GCPModule,
        MailModule,
        TranslationModule,
        CategoryModule,
    ],
})
export class RoutesPublicModule {}
