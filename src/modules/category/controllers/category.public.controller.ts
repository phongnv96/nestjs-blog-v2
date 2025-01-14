import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { CategoryService } from '../services/category.service';
import { CategoryGetSerialization } from '../serializations/category.get.serialization';
import { CategoryGetDoc, CategoryListDoc } from '../docs/category.docs';
import {
    CATEGORY_DEFAULT_PER_PAGE,
    CATEGORY_DEFAULT_ORDER_BY,
    CATEGORY_DEFAULT_ORDER_DIRECTION,
    CATEGORY_DEFAULT_AVAILABLE_SEARCH,
    CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/category.list.constant';
import { IResponse } from 'src/common/response/interfaces/response.interface';

@ApiTags('modules.public.category')
@Controller('public/category')
export class CategoryPublicController {
    constructor(private readonly categoryService: CategoryService) {}

    /**
     * Get a paginated list of categories
     */
    @CategoryListDoc()
    @ResponsePaging('category.list', {
        serialization: CategoryGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get()
    async findAll(
        @PaginationQuery(
            CATEGORY_DEFAULT_PER_PAGE,
            CATEGORY_DEFAULT_ORDER_BY,
            CATEGORY_DEFAULT_ORDER_DIRECTION,
            CATEGORY_DEFAULT_AVAILABLE_SEARCH,
            CATEGORY_DEFAULT_AVAILABLE_ORDER_BY
        )
        paginationQuery: PaginationListDto,
        @Query('type') type?: string
    ) {
        const { _limit, _offset, _order } = paginationQuery;

        const filter = type ? { type } : {};
        const categories = await this.categoryService.findAll(filter, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });

        const total = await this.categoryService.getTotal(filter);
        const totalPage = Math.ceil(total / _limit);

        return {
            _pagination: { total, totalPage },
            data: categories,
        };
    }

    /**
     * Get category details by ID
     */
    @CategoryGetDoc()
    @Response('category.get', { serialization: CategoryGetSerialization })
    @ApiKeyPublicProtected()
    @Get(':id')
    async findOneById(@Param('id') id: string) {
        return this.categoryService.findOneById(id);
    }

    @CategoryListDoc()
    @Response('category.tree', {
        serialization: CategoryGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/tree')
    async getTree(@Param('type') type: 'post' | 'product'): Promise<IResponse> {
        const data = await this.categoryService.getCategoryTreeWithCounts(type);

        return {
            data: data,
        };
    }
}
