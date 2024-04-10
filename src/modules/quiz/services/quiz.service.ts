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
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { QuizDoc, QuizEntity } from '../repository/entities/quiz.entity';
import { IQuizService } from '../interfaces/quiz.service.interface';
import { QuizCreateDto } from '../dtos/quiz.create.dto';
import { QuizRepository } from '../repository/repositories/quiz.repository';
import { ClientSession } from 'mongodb';

@Injectable()
export class QuizService implements IQuizService {
    private readonly uploadPath: string;

    constructor(
        private readonly quizRepository: QuizRepository,
        private readonly configService: ConfigService,
        private readonly helperStringService: HelperStringService
    ) {
        this.uploadPath = this.configService.get<string>('quiz.uploadPath');
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<QuizEntity[]> {
        return this.quizRepository.findAll<QuizEntity>(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc> {
        return this.quizRepository.findOneById<QuizDoc>(_id, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc> {
        return this.quizRepository.findOne<QuizDoc>(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizDoc> {
        return this.quizRepository.findOne<QuizDoc>({ name }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.quizRepository.getTotal(find, options);
    }

    async existByTitle(
        title: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.quizRepository.exists(
            {
                title,
            },
            { ...options, withDeleted: true }
        );
    }

    async create(
        { title, description, photo, path }: QuizCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<QuizDoc> {
        const create: QuizEntity = new QuizEntity();
        create.title = title;
        create.photo = photo;
        create.description = description;
        create.slug = this.helperStringService.generateSlug(title);
        create.path = path;
        return this.quizRepository.create<QuizEntity>(create, options);
    }

    async update(
        id: string,
        { title, description, photo, path }: QuizCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc> {
        const quizUpdate = await this.quizRepository.findOneById(id);
        quizUpdate.description = description;
        quizUpdate.title = title;
        quizUpdate.photo = photo;
        quizUpdate.path = path;
        quizUpdate.slug = this.helperStringService.generateSlug(title);
        return this.quizRepository.save(quizUpdate, options);
    }

    async updateMany(
        find: Record<string, any>,
        data: any,
        options?: IDatabaseManyOptions<ClientSession>
    ): Promise<boolean> {
        return await this.quizRepository.updateMany(find, data, options);
    }

    async delete(
        repository: QuizDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc> {
        return this.quizRepository.delete(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.quizRepository.deleteMany(find, options);
    }

    async createMany(
        data: QuizCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: QuizEntity[] = data.map(
            ({ title, description, photo, path }) => {
                const entity: QuizEntity = new QuizEntity();
                entity.title = title;
                entity.photo = photo;
                entity.description = description;
                entity.path = path;
                entity.slug = this.helperStringService.generateSlug(title);
                return entity;
            }
        );
        return this.quizRepository.createMany<QuizEntity>(create, options);
    }
}
