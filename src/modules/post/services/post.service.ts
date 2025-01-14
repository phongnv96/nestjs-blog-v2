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
import { IPostService } from '../interfaces/post.service.interface';
import { PostCreateDto } from '../dtos/post.create.dto';
import { PostEntity, PostDoc } from '../repository/entities/post.entity';
import { PostRepository } from '../repository/repositories/post.repository';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { TranslationService } from '../../translation/services/translation.service';
import { PostUpdateDto } from '../dtos/post.update.dto';
import { ViewCreateDto } from '../dtos/view.create.dto';
import { ViewService } from './view.service';
import { PostGetDto } from '../dtos/post.get.dto';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { PostGetHomeDto } from '../dtos/post.home.dto';
import { CategoryService } from 'src/modules/category/services/category.service';

@Injectable()
export class PostService implements IPostService {
    private readonly uploadPath: string;

    constructor(
        private readonly postRepository: PostRepository,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
        private readonly translationService: TranslationService,
        private readonly viewHistory: ViewService,
        private readonly categoryService: CategoryService
    ) {
        this.uploadPath = this.configService.get<string>('post.uploadPath');
    }

    async increasingView(id: string, view: ViewCreateDto): Promise<any> {
        const post = await this.postRepository.findOne({ _id: id });
        post.views += 1;
        await this.postRepository.save(post);
        await this.viewHistory.create(view);
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.postRepository.findAll<T>(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<PostDoc> {
        return this.postRepository.findOneById<PostDoc>(_id, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<PostGetDto> {
        const dataPost: any = (
            await this.postRepository.findOne<PostDoc>(find, options)
        )?.toObject<PostCreateDto>();
        if (!dataPost) {
            return null;
        }
        const categoriesId = dataPost.categories;
        const categories = [];
        if (categoriesId.length) {
            for (const item of categoriesId) {
                const subCategories =
                    await this.categoryService.findCategoryTree(
                        {
                            _id: item,
                        },
                        'post'
                    );
                if (subCategories) {
                    categories.push(subCategories);
                }
            }
        }
        dataPost.categories = categories;
        return dataPost;
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<PostDoc> {
        return this.postRepository.findOne<PostDoc>({ name }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.postRepository.getTotal(find, options);
    }

    async existByTitle(
        titles: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.postRepository.exists(
            {
                'translations.title': { $in: titles },
            },
            { ...options, withDeleted: true }
        );
    }

    async create(
        {
            tags,
            thumbnail,
            photo,
            translations,
            author,
            categories,
        }: PostCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<PostDoc> {
        const translationsId: any =
            await this.translationService.createMany(translations);
        const create: PostEntity = new PostEntity();
        create.tags = tags;
        create.thumbnail = thumbnail;
        create.photo = photo;
        create.translations = translationsId;
        create.author = author;
        create.categories = categories;
        return this.postRepository.create<PostEntity>(create, options);
    }

    async update(
        repository: PostDoc,
        postUpdate: PostUpdateDto,
        options?: IDatabaseSaveOptions
    ): Promise<PostDoc> {
        const {
            author,
            tags,
            translations,
            photo,
            thumbnail,
            categories,
            claps,
        } = postUpdate;
        (repository.author = author),
            (repository.tags = tags),
            (repository.photo = photo),
            (repository.thumbnail = thumbnail),
            (repository.categories = categories),
            (repository.claps = claps);
        for (const translation of translations) {
            const translationDoc = await this.translationService.findOne({
                _id: translation._id,
            });
            if (translationDoc) {
                await this.translationService.update(
                    translationDoc,
                    translation
                );
            } else {
                // const newTrans = await this.translationService.create(
                //     translation
                // );
                // repository.translations.push(newTrans._id);
            }
        }
        return this.postRepository.save(repository, options);
    }

    async delete(
        repository: PostDoc,
        options?: IDatabaseSaveOptions
    ): Promise<PostDoc> {
        return this.postRepository.delete(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.postRepository.deleteMany(find, options);
    }

    async createMany(
        data: PostCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        const create: PostEntity[] = data.map(({ tags, thumbnail, photo }) => {
            const entity: PostEntity = new PostEntity();
            entity.tags = tags;
            entity.thumbnail = thumbnail;
            entity.photo = photo;

            return entity;
        });
        return this.postRepository.createMany<PostEntity>(create, options);
    }

    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async getHomeHeaderPost(lang: string): Promise<PostGetHomeDto> {
        const queryPost: IDatabaseFindAllOptions = {
            paging: {
                limit: 3,
                offset: 0,
            },
            order: { views: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
            join: [
                {
                    path: 'translations',
                    select: '-content',
                    match: { language: lang },
                },
                { path: 'author', select: 'firstName lastName _id' },
            ],
        };
        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const findFofM = { createdAt: { $gte: startOfMonth } };

        const featuredOfMonth = await this.postRepository.findAll(
            findFofM,
            queryPost
        );

        const findPopularPost = {
            _id: { $nin: featuredOfMonth.map((item) => item._id) },
        };

        const popularPost = await this.postRepository.findAll(
            findPopularPost,
            queryPost
        );

        const tags = (
            await this.postRepository.raw([
                { $unwind: '$tags' }, // Deconstructs the tags array
                {
                    $addFields: {
                        normalizedTag: {
                            $trim: { input: { $toLower: '$tags' } },
                        },
                    },
                }, // Normalize tags
                {
                    $group: {
                        // Groups the documents by normalized tag
                        _id: '$normalizedTag', // Group by the normalized tag
                        count: { $sum: 1 }, // Count the occurrences
                    },
                },
                { $sort: { count: -1 } }, // Sort by count in descending order
                { $limit: 10 }, // Limit to top 10
            ])
        ).map((item: any) => item._id);

        return {
            featuredOfMonth,
            popularPost,
            tags: tags,
        };
    }
}
