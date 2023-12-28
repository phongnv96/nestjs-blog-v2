import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "src/common/doc/constants/doc.enum.constant";
import { Doc, DocAuth, DocRequest, DocGuard, DocResponse, DocResponsePaging, DocRequestFile } from "src/common/doc/decorators/doc.decorator";
import { ResponseIdSerialization } from "src/common/response/serializations/response.id.serialization";
import { PostCreateDto } from "../dtos/post.create.dto";
import { PostListSerialization } from "../serializations/post.list.serializations";
import { FileSingleDto } from "src/common/file/dtos/file.single.dto";
import { PostDocParamsId } from "../constants/post.doc.contant";
import { PostGetSerialization } from "../serializations/post.get.serializations";
import { PostGetHomeHeaderSerialization } from "../serializations/post.get.home.header.serializations";

export function PostListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get all of posts',
        }),
        DocRequest({
            queries: [],
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<PostListSerialization>('post.list', {
            serialization: PostListSerialization,
        })
    );
}

export function PostAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'create a post',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: PostCreateDto,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('post.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function PostUploadProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'post upload photo',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequestFile({
            body: FileSingleDto,
        }),
        DocResponse('post.upload')
    );
}


export function PostDetailGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get detail an post',
        }),
        DocRequest({
            params: PostDocParamsId,
        }),
        DocAuth({
            apiKey: true,
        }),
        DocResponse<PostGetSerialization>('pose.get', {
            serialization: PostGetSerialization,
        })
    );
}

export function PostGetHomeHeaderDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get home header posts',
        }),
        DocAuth({
            apiKey: true,
        }),
        DocResponse<PostGetHomeHeaderSerialization>('pose.get-home-header', {
            serialization: PostGetHomeHeaderSerialization,
        })
    );
}