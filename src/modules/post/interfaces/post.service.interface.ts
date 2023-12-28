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
import { PostEntity, PostDoc } from '../repository/entities/post.entity';
import { PostCreateDto } from '../dtos/post.create.dto';
import { ViewCreateDto } from '../dtos/view.create.dto';
import { PostGetDto } from '../dtos/post.get.dto';
import { PostGetHomeDto } from '../dtos/post.home.dto';

export interface IPostService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<PostEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<PostDoc>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<PostGetDto>;
    findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<PostDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    existByTitle(
        name: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    create(
        data: PostCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<PostDoc>;
    // update(
    //     repository: PostDoc,
    //     data: PostUpdateDto,
    //     options?: IDatabaseSaveOptions
    // ): Promise<PostDoc>;
    // active(
    //     repository: PostDoc,
    //     options?: IDatabaseSaveOptions
    // ): Promise<PostDoc>;
    // inactive(
    //     repository: PostDoc,
    //     options?: IDatabaseSaveOptions
    // ): Promise<PostDoc>;
    delete(
        repository: PostDoc,
        options?: IDatabaseSaveOptions
    ): Promise<PostDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    createMany(
        data: PostCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
    createPhotoFilename(): Promise<Record<string, any>>;
    increasingView(id: string, view: ViewCreateDto): Promise<any>;
    getHomeHeaderPost(
        lang: string
    ): Promise<PostGetHomeDto>;
}
