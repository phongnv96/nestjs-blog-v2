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
import { ConfigService } from '@nestjs/config';
import {
    TranslationDoc,
    TranslationEntity,
} from '../repository/entities/translation.entity';
import { ITranslationService } from '../interfaces/translation.service.interface';
import { TranslationCreateDto } from '../dtos/translation.create.dto';
import { TranslationRepository } from '../repository/repositories/translation.repository';

@Injectable()
export class TranslationService implements ITranslationService {
    private readonly uploadPath: string;
    constructor(
        private readonly TranslationRepository: TranslationRepository,
        private readonly configService: ConfigService
    ) {
        this.uploadPath = this.configService.get<string>(
            'Translation.uploadPath'
        );
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<TranslationEntity[]> {
        return this.TranslationRepository.findAll<TranslationEntity>(
            find,
            options
        );
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc> {
        return this.TranslationRepository.findOneById<TranslationDoc>(
            _id,
            options
        );
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc> {
        return this.TranslationRepository.findOne<TranslationDoc>(
            find,
            options
        );
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<TranslationDoc> {
        return this.TranslationRepository.findOne<TranslationDoc>(
            { name },
            options
        );
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.TranslationRepository.getTotal(find, options);
    }

    async existByTitle(
        title: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.TranslationRepository.exists(
            {
                title,
            },
            { ...options, withDeleted: true }
        );
    }

    async create(
        { title, content, description, language }: TranslationCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<TranslationDoc> {
        const create: TranslationEntity = new TranslationEntity();
        create.title = title;
        create.content = content;
        create.description = description;
        create.language = language;
        return this.TranslationRepository.create<TranslationEntity>(
            create,
            options
        );
    }

    async update(
        repository: TranslationDoc,
        { description, title, language, content }: TranslationCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<TranslationDoc> {
        if (repository) {
            repository.description = description;
            (repository.title = title),
                (repository.language = language),
                (repository.content = content);

            return this.TranslationRepository.save(repository, options);
        }
    }

    async delete(
        repository: TranslationDoc,
        options?: IDatabaseSaveOptions
    ): Promise<TranslationDoc> {
        return this.TranslationRepository.delete(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.TranslationRepository.deleteMany(find, options);
    }

    async createMany(
        data: TranslationCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: TranslationEntity[] = data.map(
            ({ title, content, description, language }) => {
                const entity: TranslationEntity = new TranslationEntity();
                entity.title = title;
                entity.content = content;
                entity.description = description;
                entity.language = language;
                return entity;
            }
        );
        return this.TranslationRepository.createMany<TranslationEntity>(
            create,
            options
        );
    }
}
