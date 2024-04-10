import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { CommentCreateDto } from '../dtos/comment.create.dto';
import { CommentGetSerialization } from '../serializations/comment.get.serilization';
import { CommentDocParamsId } from '../constants/comment.doc.constant';

export function CommentCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'create a comment',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: CommentCreateDto,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('comment.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function CommentListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get comments by post id',
        }),
        DocRequest({
            params: CommentDocParamsId,
        }),
        DocAuth({
            apiKey: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<CommentGetSerialization[]>('comment.list', {
            serializationArray: CommentGetSerialization,
        })
    );
}
