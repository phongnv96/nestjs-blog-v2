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
    CommentEntity,
    CommentDoc,
} from '../repository/entities/comment.entity';
import { CommentCreateDto } from '../dtos/comment.create.dto';

export interface ICommentService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CommentEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc>;
    findAllCommentsByPostId(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentEntity[]>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(data: any, options?: IDatabaseCreateOptions): Promise<CommentDoc>;
    update(
        id: string,
        data: CommentCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<CommentDoc>;
    delete(
        repository: CommentDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CommentDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: any[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
    getMaxRightValue(): Promise<number>;
}
