import {
    Controller,
    Get,
    Param,
    Headers,
    Req,
    Res,
    NotFoundException, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';

import {
    POST_DEFAULT_AVAILABLE_ORDER_BY,
    POST_DEFAULT_AVAILABLE_SEARCH,
    POST_DEFAULT_ORDER_BY,
    POST_DEFAULT_ORDER_DIRECTION,
    POST_DEFAULT_PER_PAGE,
} from '../constants/post.list.constant';
import { PostEntity } from '../repository/entities/post.entity';
import { PostService } from '../services/post.service';
import { PostListSerialization } from '../serializations/post.list.serializations';
import { PostGetSerialization } from '../serializations/post.get.serializations';
import { PostRequestDto } from '../dtos/post.request.dto';
import {
    PostDetailGetDoc,
    PostGetHomeHeaderDoc,
    PostListDoc,
} from '../docs/post.docs';
import { Response as EResponse, Request as ERequest } from 'express';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { ENUM_POST_STATUS_CODE_ERROR } from '../constants/post.status-code.constant';
import { PostGetHomeHeaderSerialization } from '../serializations/post.get.home.header.serializations';
import { CategoryService } from '../services/category.service';
import { TranslationService } from '../services/translation.service';

@ApiTags('modules.public.post')
@Controller({
    version: '1',
    path: '/post',
})
export class PostPublicController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly PostService: PostService,
        private readonly translationServices: TranslationService,
        private readonly categoryService: CategoryService
    ) {}

    @PostListDoc()
    @ResponsePaging('post.list', {
        serialization: PostListSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/list')
    async list(
        @Headers('x-custom-lang') lang: string,
        @PaginationQuery(
            POST_DEFAULT_PER_PAGE,
            POST_DEFAULT_ORDER_BY,
            POST_DEFAULT_ORDER_DIRECTION,
            POST_DEFAULT_AVAILABLE_SEARCH,
            POST_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
        // @PaginationQueryFilterInBoolean('isActive', POST_DEFAULT_IS_ACTIVE)
        // isActive: Record<string, any>,
    ): Promise<IResponsePaging> {
        console.log('x-custom-lang: ', lang);
        const find: Record<string, any> = {
            ..._search,
            // ...isActive,
        };

        const Posts: PostEntity[] = await this.PostService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
            join: [
                {
                    path: 'translations',
                    select: '-content',
                    match: { language: lang },
                },
                { path: 'author', select: 'firstName lastName _id' },
            ],
        });

        const total: number = await this.PostService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: Posts,
        };
    }

    @Response('post.get-home-feature', {
        serialization: PostGetHomeHeaderSerialization,
    })
    @PostGetHomeHeaderDoc()
    @ApiKeyPublicProtected()
    @Get('get/home/popular')
    async get(@Headers('x-custom-lang') lang: string): Promise<IResponse> {
        const data = await this.PostService.getHomeHeaderPost(lang);
        return {
            data,
        };
    }

    @Response('post.get', {
        serialization: PostGetSerialization,
    })
    @PostDetailGetDoc()
    @ApiKeyPublicProtected()
    @RequestParamGuard(PostRequestDto)
    @Get('get/:slug')
    async getDetailPost(
        @Headers('x-custom-lang') language: string,
        @Param() { slug }: PostRequestDto,
        @Req() request: ERequest,
        @Res({ passthrough: true }) response: EResponse,
        @GetUser() user: UserEntity
    ): Promise<IResponse> {
        const translation = await this.translationServices.findOne({slug: slug})
        if(!translation) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }
        const detailPost = await this.PostService.findOne({
            'translations' : translation._id
            },
            {
                join: [
                    {
                        path: 'translations',
                        match: { language: language},
                    },
                ],
            }
        );
        if (!detailPost) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }
        const cookiePostDetail = request?.cookies?.[slug];
        console.log('cookie-read: ', cookiePostDetail);
        if (!cookiePostDetail) {
            response.cookie(detailPost._id, slug, {
                httpOnly: true,
                maxAge: 2 * 60 * 1000,
            });
            await this.PostService.increasingView(detailPost._id, {
                ipAddress: request.ip,
                userId: user?._id || null,
                postId: detailPost._id,
            });
        }
        return { data: detailPost };
    }

    @PostListDoc()
    @ResponsePaging('post.list', {
        serialization: PostListSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/category')
    async getPostByCategory(
        @Headers('x-custom-lang') lang: string,
        @PaginationQuery(
            POST_DEFAULT_PER_PAGE,
            POST_DEFAULT_ORDER_BY,
            POST_DEFAULT_ORDER_DIRECTION,
            POST_DEFAULT_AVAILABLE_SEARCH,
            POST_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @Query() { slug }: any
    ): Promise<IResponsePaging> {
        console.log('x-custom-lang: ', lang);
        const find: Record<string, any> = {
            ..._search,
            // ...isActive,
        };

        // Find the category by slug to get its path
        const category = await this.categoryService.findOne({ slug });
        if (!category) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }

        // Find all categories that start with the main category's path
        const categories = await this.categoryService.findAll({
            slug: new RegExp('^' + slug),
        });

        // Extract the IDs from the categories
        const categoryIds = categories.map((cat) => cat._id);

        const Posts: PostEntity[] = await this.PostService.findAll(
            { ...find, categories: { $in: categoryIds } },
            {
                paging: {
                    limit: _limit,
                    offset: _offset,
                },
                order: _order,
                join: [
                    {
                        path: 'translations',
                        select: '-content',
                        match: { language: lang },
                    },
                    { path: 'author', select: 'firstName lastName _id' },
                ],
            }
        );

        const total: number = await this.PostService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: Posts,
        };
    }
}
