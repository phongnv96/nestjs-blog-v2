import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { ICommentService } from '../interfaces/comment.service.interface';
import { CommentRepository } from '../repository/repositories/comment.repository';
import {
    CommentDoc,
    CommentEntity,
} from '../repository/entities/comment.entity';
import { CommentCreateDto } from '../dtos/comment.create.dto';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../../../common/pagination/constants/pagination.enum.constant';

@Injectable()
export class CommentService implements ICommentService {
    constructor(private readonly commentRepository: CommentRepository) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CommentEntity[]> {
        return this.commentRepository.findAll<CommentEntity>(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc> {
        return this.commentRepository.findOneById<CommentDoc>(_id, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc> {
        return this.commentRepository.findOne<CommentDoc>(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentDoc> {
        return this.commentRepository.findOne<CommentDoc>({ name }, options);
    }

    async findAllCommentsByPostId(
        postId: string,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentEntity[]> {
        // Step 1: Fetch all comments for the post
        const comments = await this.findAll(
            { post: postId },
            {
                order: { left: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
                join: [
                    {
                        path: 'author',
                        select: ['firstName', 'lastName', 'photo'],
                        match: { blocked: false, isActive: true },
                    },
                    {
                        path: 'likes',
                        select: ['firstName', 'lastName', 'photo', '_id'],
                    },
                ],
                ...options,
            }
        );

        if (!comments?.length) {
            return [];
        }

        // Step 2: Function to recursively nest comments
        function nestComments(commentList: CommentEntity[], parentId = null) {
            return commentList
                .filter(
                    (comment) => comment.parentId === parentId && comment.author
                )
                .map((comment) => ({
                    ...comment,
                    children: nestComments(commentList, comment._id),
                }));
        }

        // Step 3: Start the nesting with top-level comments
        return nestComments(comments);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.commentRepository.getTotal(find, options);
    }

    async existByTitle(
        title: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.commentRepository.exists(
            {
                title,
            },
            { ...options, withDeleted: true }
        );
    }
    async getMaxRightValue() {
        // Find the comment with the highest 'right' value
        const commentWithMaxRight = await (await this.commentRepository.model())
            .findOne()
            .sort({ right: -1 })
            .limit(1);

        // If no comments are present, start from 0
        if (!commentWithMaxRight) {
            return 0;
        }
        // Return the highest 'right' value
        return commentWithMaxRight.right;
    }

    async create(
        { author, content, photo, thumbnail, parentId, post }: CommentCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CommentDoc> {
        const parentComment = await this.commentRepository.findOneById(
            parentId
        );
        const rightValue = parentComment
            ? parentComment.right
            : await this.getMaxRightValue();
        const repository = await this.commentRepository.model();
        // Update existing comments
        await repository.updateMany(
            { right: { $gte: rightValue } },
            { $inc: { right: 2 } }
        );
        await repository.updateMany(
            { left: { $gt: rightValue } },
            { $inc: { left: 2 } }
        );

        // Create new comment
        const create = new CommentEntity();
        create.author = author;
        create.content = content;
        create.photo = photo;
        create.thumbnail = thumbnail;
        create.parentId = parentId;
        create.post = post;
        create.left = rightValue;
        create.right = rightValue + 1;
        return this.commentRepository.create(create);
    }

    async update(
        id: string,
        { content, photo, thumbnail, parentId, post, likes }: CommentDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CommentDoc> {
        const commentUpdate = await this.commentRepository.findOneById(id);
        commentUpdate.content = content;
        commentUpdate.photo = photo;
        commentUpdate.thumbnail = thumbnail;
        commentUpdate.parentId = parentId;
        commentUpdate.post = post;
        commentUpdate.likes = likes;

        return this.commentRepository.save(commentUpdate, options);
    }

    async delete(
        comment: CommentDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CommentDoc> {
        // Step 1: Find the comment to be deleted
        const commentToDelete = await this.commentRepository.findOneById(
            comment._id
        );
        if (!commentToDelete) {
            throw new Error('Comment not found');
        }

        // Step 2: Calculate the width of the subtree rooted at this comment
        const width = commentToDelete.right - commentToDelete.left + 1;
        const repository = await this.commentRepository.model();
        // Step 3: Remove the comment and its subtree
        await repository.deleteMany({
            left: { $gte: commentToDelete.left },
            right: { $lte: commentToDelete.right },
        });

        // Step 4: Update left and right values of the remaining comments
        await repository.updateMany(
            { left: { $gt: commentToDelete.right } },
            { $inc: { left: -width } }
        );
        await repository.updateMany(
            { right: { $gt: commentToDelete.right } },
            { $inc: { right: -width } }
        );
        return this.commentRepository.delete(comment, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.commentRepository.deleteMany(find, options);
    }

    async createMany(
        data: any[],
        options?: IDatabaseCreateManyOptions
    ): Promise<any> {
        const create: CommentEntity[] = data.map(
            ({ content, photo, thumbnail, parentId, post }) => {
                const entity: CommentEntity = new CommentEntity();
                entity.photo = photo;
                entity.content = content;
                entity.thumbnail = thumbnail;
                entity.parentId = parentId;
                entity.post = post;
                return entity;
            }
        );
        return this.commentRepository.createMany<CommentEntity>(
            create,
            options
        );
    }
}
