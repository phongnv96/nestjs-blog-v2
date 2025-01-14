import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryUpdateDto } from '../dtos/category.update.dto';
import { CategoryGetSerialization } from '../serializations/category.get.serialization';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';

export function CategoryAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'create a category',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: CategoryCreateDto,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('category.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function CategoryUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update an existing category',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            body: CategoryUpdateDto,
        }),
        DocResponse<CategoryGetSerialization>('category.update', {
            httpStatus: HttpStatus.OK,
            serialization: CategoryGetSerialization,
        })
    );
}

export function CategoryDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Delete a category',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    type: String,
                    description: 'Category ID',
                    required: true,
                },
            ],
        }),
        DocResponse<ResponseIdSerialization>('category.delete', {
            httpStatus: HttpStatus.OK,
            serialization: ResponseIdSerialization,
        })
    );
}

export function CategoryGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a category by ID',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    type: String,
                    description: 'Category ID',
                    required: true,
                },
            ],
        }),
        DocResponse<CategoryGetSerialization>('category.get', {
            serialization: CategoryGetSerialization,
        })
    );
}

export function CategoryListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get a list of categories',
        }),
        DocResponse<CategoryGetSerialization[]>('category.list', {})
    );
}
