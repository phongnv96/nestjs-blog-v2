import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PostCreateDto } from './post.create.dto';
import { CategoryCreateDto } from 'src/modules/category/dtos/category.create.dto';

export class PostGetDto extends OmitType(PostCreateDto, ['categories']) {
    @ApiProperty({
        description: 'categories for search',
    })
    @IsArray()
    readonly categories?: CategoryCreateDto[];
}
