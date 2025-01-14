import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseGetTotalOptions,
    IDatabaseSaveOptions,
    IDatabaseExistOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    ProductEntity,
    ProductDoc,
} from '../repository/entities/product.entity';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';

export interface IProductService {
    findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;

    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ProductDoc>;

    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;

    create(
        data: ProductCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<ProductDoc>;

    update(
        repository: ProductDoc,
        data: ProductUpdateDto,
        options?: IDatabaseSaveOptions
    ): Promise<ProductDoc>;

    delete(
        repository: ProductDoc,
        options?: IDatabaseSaveOptions
    ): Promise<ProductDoc>;

    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;

    createMany(
        data: ProductCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;

    createPhotoFilename(): Promise<Record<string, any>>;

    addRating(
        productId: string,
        userId: string,
        rating: number,
        review?: string
    ): Promise<any>;

    existByTitle(
        titles: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean>;

    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<ProductDoc>;
}
