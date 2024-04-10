import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';
export class CommentLikeDto {
    @ApiProperty({
        description: 'likes of comment',
    })
    @IsArray()
    @IsOptional()
    readonly likes?: string[];
}
