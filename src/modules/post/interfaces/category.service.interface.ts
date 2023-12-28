import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseGetTotalOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    CategoryEntity,
    CategoryDoc,
} from '../repository/entities/category.entity';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryDto } from '../dtos/categpry.dto';
import { ClientSession } from 'mongoose';

export interface ICategoryService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CategoryEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CategoryDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: CategoryCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CategoryDoc>;
    update(
        id: string,
        data: CategoryCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc>;
    updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean>;
    delete(
        repository: CategoryDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CategoryDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: CategoryCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
    getCategoryTreeWithPostCounts(): Promise<CategoryDto[]>;
}
