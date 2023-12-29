import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "src/common/doc/constants/doc.enum.constant";
import { Doc, DocAuth, DocRequest, DocGuard, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { ResponseIdSerialization } from "src/common/response/serializations/response.id.serialization";
import { CategoryCreateDto } from "../dtos/category.create.dto";
import { CategoryGetSerialization } from "../serializations/category.get.serializations";

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


export function CategoryListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get tree category',
        }),
        DocRequest({
            queries: [],
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<CategoryGetSerialization[]>('category.list', {
            serializationArray: CategoryGetSerialization,
        })
    );
}
