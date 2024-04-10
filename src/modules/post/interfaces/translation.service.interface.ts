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
import { TranslationCreateDto } from '../dtos/translation.create.dto';
import {
    TranslationDoc,
    TranslationEntity,
} from '../repository/entities/translation.entity';

export interface ITranslationService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<TranslationEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: TranslationCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<TranslationDoc>;
    update(
        repository: TranslationDoc,
        data: TranslationCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<TranslationDoc>;
    // active(
    //     repository: TranslationDoc,
    //     options?: IDatabaseSaveOptions
    // ): Promise<TranslationDoc>;
    // inactive(
    //     repository: TranslationDoc,
    //     options?: IDatabaseSaveOptions
    // ): Promise<TranslationDoc>;
    delete(
        repository: TranslationDoc,
        options?: IDatabaseSaveOptions
    ): Promise<TranslationDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: TranslationCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
