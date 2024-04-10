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
import { QuizEntity, QuizDoc } from '../repository/entities/quiz.entity';
import { QuizCreateDto } from '../dtos/quiz.create.dto';
import { ClientSession } from 'mongoose';

export interface IQuizService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<QuizEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: QuizCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<QuizDoc>;
    update(
        id: string,
        data: QuizCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc>;
    updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean>;
    delete(
        repository: QuizDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: QuizCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
