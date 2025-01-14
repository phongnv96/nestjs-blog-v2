import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocGuard,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductListSerialization } from '../serizlizations/product.list.serialization';
import { ProductGetSerialization } from '../serizlizations/product.get.serialization';

export function ProductListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get a list of products',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<ProductListSerialization>('product.list', {
            serialization: ProductListSerialization,
        })
    );
}

export function ProductAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new product',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: ProductCreateDto,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('product.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function ProductDetailGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get product details by ID',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    type: String,
                    description: 'Product ID',
                    required: true,
                },
            ],
        }),
        DocAuth({
            apiKey: true,
        }),
        DocResponse<ProductGetSerialization>('product.get', {
            serialization: ProductGetSerialization,
        })
    );
}

export function ProductUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update a product',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: ProductCreateDto, // You can use a dedicated ProductUpdateDto if required
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('product.update', {
            httpStatus: HttpStatus.OK,
            serialization: ResponseIdSerialization,
        })
    );
}

export function ProductDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Delete a product',
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
                    description: 'Product ID',
                    required: true,
                },
            ],
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('product.delete', {
            httpStatus: HttpStatus.OK,
            serialization: ResponseIdSerialization,
        })
    );
}
