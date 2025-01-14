import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
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
import { ENUM_COMMENT_REFERENCE_TYPE } from '../constants/comment.enum.constant';

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
        // Update to use reference type
        return this.findAllCommentsByReference(
            postId,
            ENUM_COMMENT_REFERENCE_TYPE.POST,
            options
        );
    }

    async findAllCommentsByReference(
        referenceId: string,
        referenceType: ENUM_COMMENT_REFERENCE_TYPE,
        options?: IDatabaseFindOneOptions
    ): Promise<CommentEntity[]> {
        const comments = await this.findAll(
            {
                reference: referenceId,
                referenceType,
                // Add proper reference type filtering
                $or: [{ referenceType }, { referenceType: { $exists: false } }],
            },
            {
                order: { left: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
                join: [
                    {
                        path: 'author',
                        select: ['firstName', 'lastName', 'photo', 'email'],
                        match: { blocked: false, isActive: true },
                    },
                    {
                        path: 'likes',
                        select: ['firstName', 'lastName', 'photo', '_id'],
                        match: { isActive: true },
                    },
                    {
                        path: 'reference',
                        select: ['_id', 'title', 'slug', 'type'],
                    },
                ],
                ...options,
            }
        );

        if (!comments?.length) {
            return [];
        }

        // Improved nesting logic with type checking
        function nestComments(
            commentList: CommentEntity[],
            parentId = null
        ): CommentEntity[] {
            return commentList
                .filter(
                    (comment) =>
                        comment.parentId === parentId &&
                        comment.author &&
                        comment.referenceType === referenceType
                )
                .map((comment) => ({
                    ...comment,
                    children: nestComments(commentList, comment._id),
                }));
        }

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
        {
            author,
            content,
            photo,
            thumbnail,
            parentId,
            reference,
            referenceType,
            likes = [],
        }: CommentCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CommentDoc> {
        // Validate parent comment
        if (parentId) {
            const parentComment =
                await this.commentRepository.findOneById(parentId);
            if (
                !parentComment ||
                parentComment.referenceType !== referenceType
            ) {
                throw new Error(
                    'Invalid parent comment or reference type mismatch'
                );
            }
        }

        const rightValue = parentId
            ? (await this.commentRepository.findOneById(parentId))?.right
            : await this.getMaxRightValue();

        const repository = await this.commentRepository.model();

        // Update tree structure within same reference
        await repository.updateMany(
            {
                right: { $gte: rightValue },
                referenceType,
                reference,
            },
            { $inc: { right: 2 } }
        );

        await repository.updateMany(
            {
                left: { $gt: rightValue },
                referenceType,
                reference,
            },
            { $inc: { left: 2 } }
        );

        const create = new CommentEntity();
        create.author = author;
        create.content = content;
        create.photo = photo;
        create.thumbnail = thumbnail;
        create.reference = new Types.ObjectId(reference);
        create.referenceType = referenceType;
        create.left = rightValue;
        create.right = rightValue + 1;
        create.likes = likes;

        return this.commentRepository.create(create, options);
    }

    async update(
        id: string,
        { content, photo, thumbnail, likes, reference, referenceType },
        options?: IDatabaseSaveOptions
    ): Promise<CommentDoc> {
        const comment = await this.commentRepository.findOneById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }

        // Update only allowed fields
        if (content) comment.content = content;
        if (photo) comment.photo = photo;
        if (thumbnail) comment.thumbnail = thumbnail;
        if (likes) comment.likes = likes;
        if (reference) comment.reference = reference;
        if (referenceType) comment.referenceType = referenceType;

        return this.commentRepository.save(comment, options);
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
            ({ content, photo, thumbnail, parentId }) => {
                const entity: CommentEntity = new CommentEntity();
                entity.photo = photo;
                entity.content = content;
                entity.thumbnail = thumbnail;
                entity.parentId = parentId;
                return entity;
            }
        );
        return this.commentRepository.createMany<CommentEntity>(
            create,
            options
        );
    }
}
