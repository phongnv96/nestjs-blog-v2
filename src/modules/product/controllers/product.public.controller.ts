import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { ProductService } from '../services/product.service';
import { ProductGetSerialization } from '../serizlizations/product.get.serialization';
import { ProductListSerialization } from '../serizlizations/product.list.serialization';
import {
    PRODUCT_DEFAULT_PER_PAGE,
    PRODUCT_DEFAULT_ORDER_BY,
    PRODUCT_DEFAULT_ORDER_DIRECTION,
    PRODUCT_DEFAULT_AVAILABLE_ORDER_BY,
    PRODUCT_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/product.list.constant';

@ApiTags('modules.public.product')
@Controller({
    version: '1',
    path: '/product',
})
export class ProductPublicController {
    constructor(private readonly productService: ProductService) {}

    @ResponsePaging('product.list', {
        serialization: ProductListSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            PRODUCT_DEFAULT_PER_PAGE,
            PRODUCT_DEFAULT_ORDER_BY,
            PRODUCT_DEFAULT_ORDER_DIRECTION,
            PRODUCT_DEFAULT_AVAILABLE_SEARCH,
            PRODUCT_DEFAULT_AVAILABLE_ORDER_BY
        )
        paginationQuery: PaginationListDto,
        @Query('search') search: string,
        @Query('lang') lang?: string
    ) {
        const { _limit, _offset, _order } = paginationQuery;

        const findOptions = search ? { $text: { $search: search } } : {};

        const products = await this.productService.findAll(findOptions, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
            lang,
            join: [
                { path: 'translations', match: lang ? { language: lang } : {} },
                { path: 'author', select: 'firstName lastName _id' },
            ],
        });

        const total = await this.productService.getTotal(findOptions);
        const totalPage = Math.ceil(total / _limit);

        return {
            _pagination: { total, totalPage },
            data: products,
        };
    }

    @Response('product.get', {
        serialization: ProductGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/get/:id')
    async get(@Param('id') id: string, @Query('lang') lang?: string) {
        return this.productService.findOneById(id, { lang });
    }

    @ResponsePaging('product.category', {
        serialization: ProductListSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/category/:categoryId')
    async getByCategory(
        @Param('categoryId') categoryId: string,
        @PaginationQuery(
            PRODUCT_DEFAULT_PER_PAGE,
            PRODUCT_DEFAULT_ORDER_BY,
            PRODUCT_DEFAULT_ORDER_DIRECTION,
            PRODUCT_DEFAULT_AVAILABLE_SEARCH,
            PRODUCT_DEFAULT_AVAILABLE_ORDER_BY
        )
        paginationQuery: PaginationListDto,
        @Query('lang') lang?: string
    ) {
        const { _limit, _offset, _order } = paginationQuery;

        const products = await this.productService.findByCategory(categoryId, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
            lang,
        });

        const total = await this.productService.getTotalByCategory(categoryId);
        const totalPage = Math.ceil(total / _limit);

        return {
            _pagination: { total, totalPage },
            data: products,
        };
    }
}
