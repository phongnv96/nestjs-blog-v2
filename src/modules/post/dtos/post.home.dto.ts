import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PostDoc } from '../repository/entities/post.entity';

export class PostGetHomeDto  {
    @ApiProperty({
        description: 'top 3 feature of month',
    })
    @IsArray()
    readonly featuredOfMonth: PostDoc[];

    @ApiProperty({
        description: 'categories for search',
    })
    @IsArray()
    readonly popularPost: PostDoc[];

    @ApiProperty({
        description: 'categories for search',
    })
    @IsArray()
    readonly tags?: string[];
}
