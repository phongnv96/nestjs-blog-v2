import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

import { QuizRepository } from './repositories/quiz.repository';
import { QuizEntity, QuizSchema } from './entities/quiz.entity';

import { HelperModule } from 'src/common/helper/helper.module';
import { AnswerEntity, AnswerSchema } from './entities/answer.entity';
import { QuestionEntity, QuestionSchema } from './entities/question.entity';

@Module({
    providers: [QuizRepository],
    exports: [QuizRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuizEntity.name,
                    schema: QuizSchema,
                },
                {
                    name: AnswerEntity.name,
                    schema: AnswerSchema,
                },
                {
                    name: QuestionEntity.name,
                    schema: QuestionSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HelperModule,
    ],
})
export class QuizRepositoryModule {}
