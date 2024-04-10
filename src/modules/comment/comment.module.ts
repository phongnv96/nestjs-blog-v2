import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user/repository/user.repository.module';
import { CommentService } from './services/comment.service';
import { CommentRepositoryModule } from './repository/comment.repository.module';

@Module({
    controllers: [],
    providers: [CommentService],
    exports: [CommentService],
    imports: [UserRepositoryModule, CommentRepositoryModule],
})
export class CommentModule {}
