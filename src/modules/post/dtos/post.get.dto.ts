import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CategoryCreateDto } from './category.create.dto';
import { PostCreateDto } from './post.create.dto';

export class PostGetDto extends OmitType(PostCreateDto, ['categories']) {
    @ApiProperty({
        description: 'categories for search',
    })
    @IsArray()
    readonly categories?: CategoryCreateDto[];
}
