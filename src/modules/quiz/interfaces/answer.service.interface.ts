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
import { AnswerEntity, AnswerDoc } from '../repository/entities/answer.entity';
import { AnswerCreateDto } from '../dtos/answer.create.dto';
import { ClientSession } from 'mongoose';

export interface IAnswerService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<AnswerEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<AnswerDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<AnswerDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<AnswerDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: AnswerCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<AnswerDoc>;
    update(
        id: string,
        data: AnswerCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<AnswerDoc>;
    updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean>;
    delete(
        repository: AnswerDoc,
        options?: IDatabaseSaveOptions
    ): Promise<AnswerDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: AnswerCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
