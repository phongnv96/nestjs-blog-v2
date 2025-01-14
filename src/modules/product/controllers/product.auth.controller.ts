import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { ProductService } from '../services/product.service';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { ProductGetSerialization } from '../serizlizations/product.get.serialization';

@ApiTags('modules.auth.product')
@Controller({
    version: '1',
    path: '/product',
})
export class ProductAuthController {
    constructor(private readonly productService: ProductService) {}

    @Response('product.create', {
        serialization: ProductGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(@Body() productCreateDto: ProductCreateDto) {
        return this.productService.create(productCreateDto);
    }

    @Response('product.update', {
        serialization: ProductGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.PRODUCT,
        action: [ENUM_POLICY_ACTION.UPDATE],
    })
    @Patch('/update/:id')
    async update(
        @Param('id') id: string,
        @Body() productUpdateDto: ProductUpdateDto
    ) {
        const product = await this.productService.findOneById(id);
        return this.productService.update(product, productUpdateDto);
    }

    @Response('product.delete', {})
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.PRODUCT,
        action: [ENUM_POLICY_ACTION.DELETE],
    })
    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        const product = await this.productService.findOneById(id);
        return this.productService.delete(product);
    }

    @Response('product.add-rating', {
        serialization: ProductGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @Post('/rating/:id')
    async addRating(
        @Param('id') productId: string,
        @Body()
        {
            userId,
            rating,
            review,
        }: { userId: string; rating: number; review?: string }
    ) {
        return this.productService.addRating(productId, userId, rating, review);
    }
}
