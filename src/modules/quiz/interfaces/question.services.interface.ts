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
import { QuestionCreateDto } from '../dtos/question.create.dto';
import { ClientSession } from 'mongoose';
import {
    QuestionDoc,
    QuestionEntity,
} from '../repository/entities/question.entity';

export interface IQuestionService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<QuestionEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuestionDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<QuestionDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuestionDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: QuestionCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<QuestionDoc>;
    update(
        id: string,
        data: QuestionCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<QuestionDoc>;
    updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean>;
    delete(
        repository: QuestionDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuestionDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: QuestionCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
