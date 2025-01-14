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

export function ProductListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Get all products' }),
        DocRequest({
            queries: [{ name: 'category', description: 'Filter by category' }],
        }),
        DocAuth({ apiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<ProductListSerialization>('product.list', {
            serialization: ProductListSerialization,
        })
    );
}

export function ProductCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new product' }),
        DocAuth({ apiKey: true, jwtAccessToken: true }),
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
