import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '../category/respository/category.repository.module';
import { CategoryRepository } from '../category/respository/category.repository';
import { ProductRepositoryModule } from '../product/repository/product.repository.module';
import { ProductRepository } from '../product/repository/product.repository';
import { TranslationRepositoryModule } from '../translation/repository/translation.repository.module';
import { TranslationRepository } from '../translation/repository/repositories/translation.repository';
import { PostRepositoryModule } from '../post/repository/post.repository.module';
import { PostRepository } from '../post/repository/repositories/post.repository';
import { UserRepository } from '../user/repository/repositories/user.repository';
import { RoleRepositoryModule } from '../role/repository/role.repository.module';
import { UserRepositoryModule } from '../user/repository/user.repository.module';
import { RoleRepository } from '../role/repository/repositories/role.repository';
import { ProductRatingRepository } from '../product/repository/product.rating.repository';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsModule } from 'src/common/aws/aws.module';
import { componentLoader } from 'src/common/helper/services/helper.component-loader.js';

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
};

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};

@Module({
    controllers: [],
    providers: [],
    imports: [
        import('@adminjs/nestjs').then(async ({ AdminModule }) =>
            AdminModule.createAdminAsync({
                imports: [
                    RoleRepositoryModule,
                    UserRepositoryModule,
                    CategoryRepositoryModule,
                    ProductRepositoryModule,
                    TranslationRepositoryModule,
                    PostRepositoryModule,
                    ConfigModule,
                    AwsModule,
                ],
                inject: [
                    RoleRepository,
                    UserRepository,
                    CategoryRepository,
                    ProductRepository,
                    ProductRatingRepository,
                    TranslationRepository,
                    PostRepository,
                    AwsS3Service,
                    ConfigService,
                ],
                useFactory: async (
                    roleRepository: RoleRepository,
                    userRepository: UserRepository,
                    categoryRepository: CategoryRepository,
                    productRepository: ProductRepository,
                    productRatingRepository: ProductRatingRepository,
                    translationRepository: TranslationRepository,
                    postRepository: PostRepository,
                    awsS3Service: AwsS3Service
                ) => {
                    const productImageUpload =
                        await awsS3Service.createUploadFeature({
                            keyField: 'downloadUrl.pathWithFilename',
                            fileField: 'downloadUrl.filename',
                            mimeTypeField: 'downloadUrl.mime',
                            basePath: 'products/downloadUrl',
                        });

                    return {
                        adminJsOptions: {
                            componentLoader,
                            rootPath: '/admin',
                            resources: [
                                {
                                    resource: userRepository.getModel(),
                                },
                                {
                                    resource: roleRepository.getModel(),
                                },
                                {
                                    resource: categoryRepository.getModel(),
                                },
                                {
                                    resource: translationRepository.getModel(),
                                },
                                {
                                    resource: productRepository.getModel(),
                                    options: {
                                        properties: {
                                            'downloadUrl.completedUrl': {
                                                isVisible: false,
                                            }, // Display the completed URL
                                            'downloadUrl.path': {
                                                isVisible: false,
                                            }, // Hide internal fields as needed
                                            'downloadUrl.pathWithFilename': {
                                                isVisible: false,
                                            },
                                            'downloadUrl.filename': {
                                                isVisible: false,
                                            },
                                            'downloadUrl.baseUrl': {
                                                isVisible: false,
                                            },
                                            'downloadUrl.mime': {
                                                isVisible: false,
                                            },
                                        },
                                    },
                                    features: [productImageUpload],
                                },
                                {
                                    resource:
                                        productRatingRepository.getModel(),
                                },
                                {
                                    resource: postRepository.getModel(),
                                },
                            ],
                        },
                        auth: {
                            authenticate,
                            cookieName: 'adminjs',
                            cookiePassword: 'secret',
                        },
                        sessionOptions: {
                            resave: true,
                            saveUninitialized: true,
                            secret: 'secret',
                        },
                    };
                },
            })
        ),
        CategoryRepositoryModule,
    ],
})
export class AdminModule {}
