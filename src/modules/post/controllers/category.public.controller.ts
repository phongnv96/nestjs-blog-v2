import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';

import { CategoryService } from '../services/category.service';
import { CategoryListDoc } from '../docs/category.docs';
import { Response } from 'src/common/response/decorators/response.decorator';
import { CategoryGetSerialization } from '../serializations/category.get.serializations';

@ApiTags('modules.public.category')
@Controller({
    version: '1',
    path: '/category',
})
export class CategoryPublicController {
    constructor(private readonly categoryService: CategoryService) {}

    @CategoryListDoc()
    @Response('category.tree', {
        serialization: CategoryGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/tree')
    async getTree(): Promise<IResponse> {
        const data = await this.categoryService.getCategoryTreeWithPostCounts();

        return {
            data: data,
        };
    }
}
