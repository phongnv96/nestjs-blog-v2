import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';

import { UserProtected } from 'src/modules/user/decorators/user.decorator';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { ENUM_CATEGORY_STATUS_CODE_ERROR } from '../constants/category.status-code.constant';
import { CategoryAdminCreateDoc } from '../docs/category.docs';
import { Response } from 'src/common/response/decorators/response.decorator';
import { CategoryGetSerialization } from '../serializations/category.get.serializations';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { UserAdminDeleteGuard } from 'src/modules/user/decorators/user.admin.decorator';
import { UserAdminDeleteDoc } from 'src/modules/user/docs/user.admin.doc';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';

@ApiTags('modules.auth.category')
@Controller({
    version: '1',
    path: '/category',
})
export class CategoryAuthController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly helperStringService: HelperStringService
    ) {}

    @CategoryAdminCreateDoc()
    @Response('category.tree', {
        serialization: CategoryGetSerialization,
    })
    @UserProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.POST,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @Post('/create')
    async create(
        @Body()
        { photo, title, description, parentId }: CategoryCreateDto
    ): Promise<IResponse> {
        const exist: boolean = await this.categoryService.existByTitle(title);
        if (exist) {
            throw new ConflictException({
                statusCode:
                    ENUM_CATEGORY_STATUS_CODE_ERROR.CATEGORY_EXIST_ERROR,
                message: 'category.error.exist',
            });
        }
        let parentPath = null;
        let slug = this.helperStringService.generateSlug(title);
        if (parentId) {
            const parent = await this.categoryService.findOneById(parentId);
            parentPath = parent.path;
            slug = `${parent.slug}/${slug}`;
        }
        const create = await this.categoryService.create({
            photo,
            title,
            description,
            parentId,
            path: parentPath ? parentPath + `/${parentId}` : parentId,
            slug
        });

        return {
            data: { _id: create._id },
        };
    }

    @UserAdminDeleteDoc()
    @Response('category.delete')
    @UserAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(UserRequestDto)
    @Delete('/delete/:categoryId')
    async delete(@Param() categoryId: string): Promise<void> {
        const category = await this.categoryService.findOneById(categoryId);
        if (!category) {
            throw new NotFoundException({
                statusCode:
                    ENUM_CATEGORY_STATUS_CODE_ERROR.CATEGORY_NOT_FOUND_ERROR,
                message: 'category.error.not.exist',
            });
        }

        if (category) {
            const categoriesHasPath = await this.categoryService.findAll({
                path: `/${category._id}/`,
            });
            if (categoriesHasPath?.length) {
            }
        }

        const updatePipeline = {
            // Use the $regexReplace operator to remove the value from the path
            path: {
                $regexReplace: {
                    input: '$path', // The field to modify
                    regex: `.*${category._id}.*`, // The pattern to find (everything substring containing valueToRemove)
                    replacement: '', // The replacement string (empty to remove the value)
                },
            },
        };
        await this.categoryService.updateMany(
            { path: new RegExp(category._id) },
            updatePipeline
        );

        await this.categoryService.delete(category);

        return;
    }
}
