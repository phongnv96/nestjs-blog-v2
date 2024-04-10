import { IsArray } from 'class-validator';
import { QuizCreateDto } from './quiz.create.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class QuizGetDto extends QuizCreateDto {
    @ApiHideProperty()
    @Exclude()
    _id?: string;

    @ApiProperty({
        description: 'sub categories of parent Quiz',
        required: false,
        type: Array,
    })
    @IsArray()
    children: QuizGetDto[];
}
