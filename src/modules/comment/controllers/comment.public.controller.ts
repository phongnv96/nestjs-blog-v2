import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';

import { CommentService } from '../services/comment.service';
import { Response } from 'src/common/response/decorators/response.decorator';
import { CommentCreateDto } from '../dtos/comment.create.dto';
import { CommentGetSerialization } from '../serializations/comment.get.serilization';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../../../common/pagination/constants/pagination.enum.constant';
import { CommentCreateDoc, CommentListDoc } from '../docs/comment.docs';
import { GetUser, UserProtected } from '../../user/decorators/user.decorator';
import { UserDoc } from '../../user/repository/entities/user.entity';
import {
    AuthJwtAdminAccessProtected,
    AuthJwtUserAccessProtected,
} from '../../../common/auth/decorators/auth.jwt.decorator';
import { CommentDoc } from '../repository/entities/comment.entity';
import { CommentLikeDto } from '../dtos/comment.like.dto';
import { ENUM_COMMENT_STATUS_CODE_ERROR } from '../constants/comment.status-code.constant';

@ApiTags('modules.public.comment')
@Controller({
    version: '1',
    path: '/comment',
})
export class CommentPublicController {
    constructor(private readonly commentService: CommentService) {}

    @CommentCreateDoc()
    @Response('comment.add', {
        serialization: CommentGetSerialization,
    })
    @UserProtected()
    @AuthJwtUserAccessProtected()
    @ApiKeyPublicProtected()
    @Post('/add')
    async addComment(
        @GetUser() user: UserDoc,
        @Body()
        { content, photo, thumbnail, parentId = null, post }: CommentCreateDto
    ): Promise<IResponse> {
        const data = await this.commentService.create({
            author: user._id,
            content,
            photo,
            thumbnail,
            parentId,
            post,
        });

        return {
            data: data._id,
        };
    }

    @CommentCreateDoc()
    @UserProtected()
    @AuthJwtUserAccessProtected()
    @ApiKeyPublicProtected()
    @Put('/like/:commentId')
    async likeComment(
        @Body()
        { likes }: CommentLikeDto,
        @Param() { commentId }: any
    ): Promise<IResponse> {
        const comment: CommentDoc = await this.commentService.findOne({
            _id: commentId,
        });
        if (!comment) {
            throw new NotFoundException({
                statusCode:
                    ENUM_COMMENT_STATUS_CODE_ERROR.COMMENT_NOT_FOUND_ERROR,
                message: 'comment.error.not.exist',
            });
        }
        comment.likes = likes;
        const data = await this.commentService.update(commentId, comment);

        return {
            data: data._id,
        };
    }

    @CommentListDoc()
    @Response('comment.list', {
        serialization: CommentGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/get/post')
    async getByPost(@Param() postId: string): Promise<IResponse> {
        const data = await this.commentService.findAll(
            {
                post: postId,
                parentId: { $exists: false },
            },
            {
                order: {
                    left: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                },
            }
        );

        return {
            data: data,
        };
    }

    @CommentListDoc()
    @Response('comments.list', {
        serialization: CommentGetSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/get/all-comments/post/:postId')
    async getAllCommentsByPost(@Param() { postId }: any): Promise<IResponse> {
        const data = await this.commentService.findAllCommentsByPostId(postId);
        return {
            data: data,
        };
    }
}
