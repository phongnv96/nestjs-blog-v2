import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import {
    IDatabaseCreateManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { CategoryRepository } from '../respository/category.repository';
import {
    CategoryDoc,
    CategoryEntity,
    CategoryType,
} from '../respository/entities/category.entity';
import { ENUM_CATEGORY_STATUS_CODE_ERROR } from '../constants/category.constants';
import { PostRepository } from 'src/modules/post/repository/repositories/post.repository';
import { ProductRepository } from 'src/modules/product/repository/product.repository';
import { ICategoryService } from '../interfaces/category.service.interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class CategoryService implements ICategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly helperStringService: HelperStringService,
        private readonly postRepository: PostRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc> {
        return this.categoryRepository.findOne<CategoryDoc>(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc> {
        return this.categoryRepository.findOne<CategoryDoc>({ name }, options);
    }

    async update(
        id: string,
        { description, title, parentId, photo }: CategoryCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc> {
        const CategoryUpdate = await this.categoryRepository.findOneById(id);
        CategoryUpdate.description = description;
        CategoryUpdate.title = title;
        CategoryUpdate.parentId = parentId;
        CategoryUpdate.photo = photo;

        return this.categoryRepository.save(CategoryUpdate, options);
    }

    // Fetch category tree with post or product counts
    async getCategoryTreeWithCounts(type: 'post' | 'product'): Promise<any> {
        const categories = await this.categoryRepository.findAll({ type });

        const buildTree = async (parentId = undefined) => {
            return Promise.all(
                categories
                    .filter((cat) => cat?.parentId === parentId)
                    .map(async (cat) => {
                        const children = await buildTree(cat._id);

                        // Count documents based on category type
                        const repo =
                            type === 'post'
                                ? this.postRepository.model()
                                : this.productRepository.model();

                        let itemCount = await (
                            await repo
                        ).countDocuments({
                            categories: {
                                $in: [cat._id],
                            },
                        });

                        children.forEach((child) => {
                            itemCount += child.itemCount;
                        });

                        return { ...cat, children, itemCount };
                    })
            );
        };

        return await buildTree();
    }

    // Get category tree by ID with parent nodes
    async getTreeById(
        id: string,
        type: 'post' | 'product',
        parent?: any
    ): Promise<any> {
        const category = await this.categoryRepository.findOne({
            _id: id,
            type,
        });
        if (!category) {
            return null;
        }

        let parentCategories = null;

        if (category.parentId) {
            parentCategories = await this.categoryRepository.findOne({
                _id: category.parentId,
                type,
            });

            parent = {
                ...parentCategories,
                children: parent ? [parent] : [category],
            };

            parent = await this.getTreeById(category.parentId, type, parent);
        }

        return parent;
    }

    // Fetch category tree recursively for a given query
    async findCategoryTree(
        query: any,
        type: 'post' | 'product'
    ): Promise<CategoryDoc[]> {
        return await this.getCategoryTreeRecursive({ ...query, type });
    }

    private async getCategoryTreeRecursive(
        query: any,
        categoryTree?: any
    ): Promise<CategoryDoc[]> {
        const category = await this.categoryRepository.findOne(query);

        if (!category) {
            return null;
        }

        categoryTree = {
            ...category,
            children: categoryTree ? [categoryTree] : [],
        };

        if (category.parentId) {
            return await this.getCategoryTreeRecursive(
                { _id: category.parentId, type: query.type },
                categoryTree
            );
        }

        return categoryTree;
    }

    // Check if a category with the given title already exists
    async existByTitle(title: string): Promise<boolean> {
        const count = await this.categoryRepository.getTotal({ title });
        return count > 0;
    }

    // Create a new category with a slug and path
    async create(data: CategoryCreateDto): Promise<CategoryDoc> {
        const { title, parentId } = data;

        // Check if the title already exists
        const exists = await this.existByTitle(title);
        if (exists) {
            throw new ConflictException({
                statusCode:
                    ENUM_CATEGORY_STATUS_CODE_ERROR.CATEGORY_EXIST_ERROR,
                message: 'category.error.exist',
            });
        }

        // Generate slug and parent path
        let parentPath = null;
        let slug = this.helperStringService.generateSlug(title);

        if (parentId) {
            const parent = await this.findOneById(parentId);
            parentPath = parent.path;
            slug = `${parent.slug}/${slug}`;
        }

        const categoryData = {
            ...data,
            path: parentPath ? `${parentPath}/${parentId}` : parentId,
            slug,
        };

        return this.categoryRepository.create(categoryData);
    }

    async createMany(
        data: CategoryCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: CategoryEntity[] = data.map(
            ({ title, description, parentId, photo, type }) => {
                const entity: CategoryEntity = new CategoryEntity();
                entity.title = title;
                entity.parentId = parentId;
                entity.description = description;
                entity.photo = photo;
                entity.type = type as CategoryType;
                return entity;
            }
        );
        return this.categoryRepository.createMany<CategoryEntity>(
            create,
            options
        );
    }

    // Find a category by ID
    async findOneById(categoryId: string): Promise<CategoryDoc> {
        const category = await this.categoryRepository.findOneById(categoryId);
        if (!category) {
            throw new NotFoundException({
                statusCode:
                    ENUM_CATEGORY_STATUS_CODE_ERROR.CATEGORY_NOT_FOUND_ERROR,
                message: 'category.error.not.exist',
            });
        }
        return category;
    }

    // Find all categories with optional filters
    async findAll(
        filter: Record<string, any> = {},
        options?: IDatabaseFindAllOptions
    ): Promise<CategoryDoc[]> {
        return this.categoryRepository.findAll(filter, options);
    }

    // Update multiple categories based on a filter
    async updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        try {
            await this.categoryRepository.updateMany(find, data, options);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Delete a specific category
    async delete(
        repository: CategoryDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc> {
        await this.categoryRepository.delete(repository, options);
        return repository;
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.categoryRepository.deleteMany(find, options);
    }

    // Delete a category and handle nested paths
    async deleteWithPath(categoryId: string): Promise<void> {
        const category = await this.findOneById(categoryId);
        if (!category) {
            throw new NotFoundException({
                statusCode:
                    ENUM_CATEGORY_STATUS_CODE_ERROR.CATEGORY_NOT_FOUND_ERROR,
                message: 'category.error.not.exist',
            });
        }

        // Find all categories with paths that include the current category
        const nestedCategories = await this.findAll({
            path: new RegExp(`/${category._id}/`),
        });

        // Handle nested categories if any exist
        if (nestedCategories.length) {
            // Update categories with nested paths
            const updatePipeline = {
                path: {
                    $regexReplace: {
                        input: '$path',
                        regex: `.*${category._id}.*`,
                        replacement: '',
                    },
                },
            };
            await this.updateMany(
                { path: new RegExp(category._id) },
                updatePipeline
            );
        }

        // Finally, delete the current category
        await this.delete(category._id);
    }

    async findAllChildren(categoryId: string) {
        const categories = await this.categoryRepository.findAll({
            path: new RegExp(categoryId),
        });

        return categories;
    }

    async getTotal(filter: Record<string, any> = {}): Promise<number> {
        return this.categoryRepository.getTotal(filter);
    }
}
