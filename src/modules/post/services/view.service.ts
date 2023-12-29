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
import { IViewService } from '../interfaces/view.service.interface';
import { ViewCreateDto } from '../dtos/view.create.dto';
import { ViewEntity, ViewDoc } from '../repository/entities/view.entity';
import { ViewRepository } from '../repository/repositories/view.repository';

@Injectable()
export class ViewService implements IViewService {
    constructor(private readonly ViewRepository: ViewRepository) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ViewEntity[]> {
        return this.ViewRepository.findAll<ViewEntity>(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc> {
        return this.ViewRepository.findOneById<ViewDoc>(_id, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc> {
        return this.ViewRepository.findOne<ViewDoc>(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<ViewDoc> {
        return this.ViewRepository.findOne<ViewDoc>({ name }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.ViewRepository.getTotal(find, options);
    }

    async existByTitle(
        title: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.ViewRepository.exists(
            {
                title,
            },
            { ...options, withDeleted: true }
        );
    }

    async create(
        { ipAddress, postId, userId }: ViewCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<ViewDoc> {
        const create: ViewEntity = new ViewEntity();
        create.ipAddress = ipAddress;
        create.postId = postId;
        create.userId = userId;
        return this.ViewRepository.create<ViewEntity>(create, options);
    }

    async update(
        id: string,
        { ipAddress, postId, userId }: ViewCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<ViewDoc> {
        const ViewUpdate = await this.ViewRepository.findOneById(id);
        ViewUpdate.ipAddress = ipAddress;
        ViewUpdate.postId = postId;
        ViewUpdate.userId = userId;

        return this.ViewRepository.save(ViewUpdate, options);
    }

    async delete(
        repository: ViewDoc,
        options?: IDatabaseSaveOptions
    ): Promise<ViewDoc> {
        return this.ViewRepository.delete(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.ViewRepository.deleteMany(find, options);
    }

    async createMany(
        data: ViewCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: ViewEntity[] = data.map(
            ({ ipAddress, postId, userId }) => {
                const entity: ViewEntity = new ViewEntity();
                entity.ipAddress = ipAddress;
                entity.postId = postId;
                entity.userId = userId;
                return entity;
            }
        );
        return this.ViewRepository.createMany<ViewEntity>(create, options);
    }
}
