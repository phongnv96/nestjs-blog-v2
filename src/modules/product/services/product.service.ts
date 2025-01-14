import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseSaveOptions,
    IDatabaseManyOptions,
    IDatabaseExistOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    ProductEntity,
    ProductDoc,
} from '../repository/entities/product.entity';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { ProductRepository } from '../repository/product.repository';
import { ProductRatingEntity } from '../repository/entities/product-rating.entity';
import { ConfigService } from '@nestjs/config';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ProductRatingRepository } from '../repository/product.rating.repository';
import { TranslationService } from '../../translation/services/translation.service';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class ProductService {
    private readonly uploadPath: string;

    constructor(
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService, // Injected Config Service
        private readonly productRepository: ProductRepository, // Injected Product Repository
        private readonly productRatingRepository: ProductRatingRepository, // Injected Product Rating Entity
        private readonly translationService: TranslationService, // Injected Translation Service
        private readonly categoryService: CategoryService // Injected Category Service
    ) {
        this.uploadPath = this.configService.get<string>('post.uploadPath');
    }

    // Fetch all products with optional filters and options
    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.productRepository.findAll<T>(find, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<ProductDoc> {
        const dataProduct: any =
            await this.productRepository.findOne<ProductDoc>(find, {
                ...options,
                join: [
                    {
                        path: 'translations',
                        match: options?.lang ? { language: options.lang } : {},
                    },
                    { path: 'author', select: 'firstName lastName _id' },
                    { path: 'categories' },
                ],
            });

        if (!dataProduct) {
            return null;
        }

        return dataProduct;
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ProductDoc> {
        return this.findOne({ _id }, options);
    }

    // Get the total count of products with optional filters
    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.productRepository.getTotal(find, options);
    }

    // Create a new product
    async create(
        { translations, ...productData }: ProductCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<ProductDoc> {
        const translationsId =
            await this.translationService.createMany(translations);
        const create: ProductEntity = new ProductEntity();
        create.translations = translationsId;
        Object.assign(create, productData);
        return this.productRepository.create<ProductEntity>(create, options);
    }

    // Update an existing product
    async update(
        repository: ProductDoc,
        { translations, ...productUpdate }: ProductUpdateDto,
        options?: IDatabaseSaveOptions
    ): Promise<ProductDoc> {
        Object.assign(repository, productUpdate);

        for (const translation of translations) {
            const translationDoc = await this.translationService.findOne({
                _id: translation._id,
            });
            if (translationDoc) {
                await this.translationService.update(
                    translationDoc,
                    translation
                );
            } else {
                const newTrans =
                    await this.translationService.create(translation);
                repository.translations.push(newTrans._id);
            }
        }
        return this.productRepository.save(repository, options);
    }

    // Delete a product
    async delete(
        repository: ProductDoc,
        options?: IDatabaseSaveOptions
    ): Promise<ProductDoc> {
        return this.productRepository.delete(repository, options);
    }

    // Delete multiple products based on a filter
    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.productRepository.deleteMany(find, options);
    }

    // Create multiple products
    async createMany(
        data: ProductCreateDto[],
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        const products = data.map((dto) =>
            Object.assign(new ProductEntity(), dto)
        );
        return this.productRepository.createMany<ProductEntity>(
            products,
            options
        );
    }

    // Generate a random filename for product photo uploads
    async createPhotoFilename(): Promise<Record<string, any>> {
        return {
            path: this.uploadPath,
            filename: this.helperStringService.random(20),
        };
    }

    // Add a rating for a product
    async addRating(
        productId: string,
        userId: string,
        rating: number,
        review?: string
    ): Promise<ProductRatingEntity> {
        const newRating = await this.productRatingRepository.create({
            productId,
            userId,
            rating,
            review,
        });

        await this.updateProductRating(productId);
        return newRating;
    }

    // Private method to update the average product rating
    private async updateProductRating(productId: string): Promise<void> {
        const ratings =
            await this.productRatingRepository.findRatingsByProduct(productId);

        if (ratings.length === 0) {
            await this.productRepository.updateRating(productId, 0, 0);
            return;
        }

        const avgRating =
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length;

        await this.productRepository.updateRating(
            productId,
            avgRating,
            ratings.length
        );
    }

    async existByTitle(
        titles: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.productRepository.exists(
            {
                'translations.title': { $in: titles },
            },
            { ...options, withDeleted: true }
        );
    }

    async findByCategory(
        categoryId: string,
        options?: IDatabaseFindAllOptions
    ): Promise<ProductDoc[]> {
        return this.productRepository.findAll(
            { categories: { $in: [categoryId] } },
            {
                ...options,
                join: [
                    {
                        path: 'translations',
                        match: options?.lang ? { language: options.lang } : {},
                    },
                    { path: 'author', select: 'firstName lastName _id' },
                    { path: 'categories' },
                ],
            }
        );
    }

    async getTotalByCategory(
        categoryId: string,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.productRepository.getTotal(
            { categories: { $in: [categoryId] } },
            options
        );
    }

    async getByCategory(
        categoryId: string,
        options: { page: number; perPage: number }
    ) {
        const { page, perPage } = options;

        // Get all child categories
        const childCategories =
            await this.categoryService.findAllChildren(categoryId);
        const categoryIds = [
            categoryId,
            ...childCategories.map((cat) => cat._id),
        ];

        // Find products with pagination
        const skip = (page - 1) * perPage;

        const [products, total] = await Promise.all([
            this.productRepository.findAll(
                { categories: { $in: categoryIds } },
                {
                    paging: {
                        limit: perPage,
                        offset: skip,
                    },
                }
            ),
            (await this.productRepository.model()).countDocuments({
                categories: { $in: categoryIds },
            }),
        ]);

        return {
            products,
            total,
        };
    }
}
