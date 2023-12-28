import { IsArray } from 'class-validator';
import { CategoryCreateDto } from './category.create.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CategoryDto extends CategoryCreateDto {
    @ApiHideProperty()
    @Exclude()
    _id?: string;

    @ApiProperty({
        description: 'sub categories of parent category',
        required: false,
        type: Array,
    })
    @IsArray()
    children: CategoryDto[];
}
