import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { PostDoc } from '../repository/entities/post.entity';

export const GetPost = createParamDecorator(
    <T>(returnPlain: boolean, ctx: ExecutionContext): T => {
        const { __Post } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __Post: PostDoc }>();
        return (returnPlain ? __Post.toObject() : __Post) as T;
    }
);
