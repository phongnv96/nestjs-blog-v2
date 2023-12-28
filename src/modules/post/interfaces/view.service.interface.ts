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
import { ViewCreateDto } from '../dtos/view.create.dto';
import { ViewEntity, ViewDoc } from '../repository/entities/view.entity';

export interface IViewService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ViewEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: ViewCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<ViewDoc>;
    update(
        id: string,
        data: ViewCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<ViewDoc>;

    delete(
        repository: ViewDoc,
        options?: IDatabaseSaveOptions
    ): Promise<ViewDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: ViewCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
