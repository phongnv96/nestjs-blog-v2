import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { ICategoryService } from '../interfaces/category.service.interface';
import { CategoryDto } from '../dtos/categpry.dto';
import { CategoryRepository } from '../repository/repositories/category.repository';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import {
    CategoryEntity,
    CategoryDoc,
} from '../repository/entities/category.entity';
import { ClientSession } from 'mongoose';
import { PostRepository } from '../repository/repositories/post.repository';

@Injectable()
export class CategoryService implements ICategoryService {
    private readonly uploadPath: string;
    constructor(
        private readonly CategoryRepository: CategoryRepository,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
        private readonly postRepository: PostRepository
    ) {
        this.uploadPath = this.configService.get<string>('Category.uploadPath');
    }

    async getCategoryTreeWithPostCounts(): Promise<any> {
        // Fetch all categories
        const categories = await this.CategoryRepository.findAll();

        // Recursive function to build tree and count posts
        const buildTree = async (parentId = undefined) => {
            return Promise.all(
                categories
                    .filter((cat) => cat?.parentId === parentId)
                    .map(async (cat) => {
                        const children = await buildTree(cat._id);
                        let postCount = await (
                            await this.postRepository.model()
                        ).countDocuments({
                            categories: {
                                $in: [
                                    cat._id,
                                    // ...children.flatMap((child) => child._id),
                                ],
                            },
                        });
                        children.forEach((child) => {
                            postCount += child.postCount;
                        });
                        return { ...cat, children, postCount };
                    })
            );
        };

        return await buildTree();
    }

    async getTreeById(id: string, parent?: any): Promise<any> {
        const categories = (
            await this.findOneById(id)
        )?.toObject<CategoryEntity>();
        let parentCategories = null;
        if (categories?.parentId) {
            parentCategories = (
                await this.findOneById(categories.parentId)
            )?.toObject<any>();

            parent = {
                ...parentCategories,
                children: parent ? [parent] : [categories],
            };

            parent = await this.getTreeById(categories.parentId, parent);
        }

        return parent;
    }

    async findCategoryTree(query: any): Promise<CategoryDto[]> {
        return await this.getCategoryTreeRecursive(query);
    }

    private async getCategoryTreeRecursive(
        query: any,
        categoryTree?: any
    ): Promise<CategoryDto[]> {
        const category = await (
            await this.CategoryRepository.findOne(query)
        )?.toObject();
        if (!category) {
            return;
        }
        categoryTree = {
            ...category,
            children: categoryTree ? [categoryTree] : [],
        };
        if (category.parentId) {
            return await this.getCategoryTreeRecursive(
                { _id: category.parentId },
                categoryTree
            );
        }
        return categoryTree;
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CategoryEntity[]> {
        return this.CategoryRepository.findAll<CategoryEntity>(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc> {
        return this.CategoryRepository.findOneById<CategoryDoc>(_id, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc> {
        return this.CategoryRepository.findOne<CategoryDoc>(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc> {
        return this.CategoryRepository.findOne<CategoryDoc>({ name }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.CategoryRepository.getTotal(find, options);
    }

    async existByTitle(
        title: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.CategoryRepository.exists(
            {
                title,
            },
            { ...options, withDeleted: true }
        );
    }

    async create(
        { title, description, parentId, photo, path, slug }: CategoryCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CategoryDoc> {
        const create: CategoryEntity = new CategoryEntity();
        create.title = title;
        create.parentId = parentId;
        create.description = description;
        create.photo = photo;
        create.path = path;
        create.slug = slug;
        return this.CategoryRepository.create<CategoryEntity>(create, options);
    }

    async update(
        id: string,
        { description, title, parentId, photo }: CategoryCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc> {
        const CategoryUpdate = await this.CategoryRepository.findOneById(id);
        CategoryUpdate.description = description;
        (CategoryUpdate.title = title),
            (CategoryUpdate.parentId = parentId),
            (CategoryUpdate.photo = photo);

        return this.CategoryRepository.save(CategoryUpdate, options);
    }

    async updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        return await this.CategoryRepository.updateMany(find, data, options);
    }

    async delete(
        repository: CategoryDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc> {
        return this.CategoryRepository.delete(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.CategoryRepository.deleteMany(find, options);
    }

    async createMany(
        data: CategoryCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: CategoryEntity[] = data.map(
            ({ title, description, parentId, photo }) => {
                const entity: CategoryEntity = new CategoryEntity();
                entity.title = title;
                entity.parentId = parentId;
                entity.description = description;
                entity.photo = photo;
                return entity;
            }
        );
        return this.CategoryRepository.createMany<CategoryEntity>(
            create,
            options
        );
    }
}
