import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { PostAuthController } from 'src/modules/post/controllers/post.auth.controller';
import { PostModule } from 'src/modules/post/post.module';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { GCPModule } from '../../common/gcp/gcp.module';
import { ProductAuthController } from 'src/modules/product/controllers/product.auth.controller';
import { OrderAuthController } from 'src/modules/order/controllers/order.auth.controller';
import { ProductModule } from 'src/modules/product/product.module';
import { OrderModule } from 'src/modules/order/order.module';
import { CategoryAuthController } from 'src/modules/category/controllers/category.auth.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { PaymentAuthController } from 'src/modules/payment/controllers/payment.auth.controller';

@Module({
    controllers: [
        UserAuthController,
        PostAuthController,
        CategoryAuthController,
        ProductAuthController,
        OrderAuthController,
        PaymentAuthController,
    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        AuthModule,
        AwsModule,
        PostModule,
        GCPModule,
        ProductModule,
        OrderModule,
        CategoryModule,
        PaymentModule,
    ],
})
export class RoutesAuthModule {}
