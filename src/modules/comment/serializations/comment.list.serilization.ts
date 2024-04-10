import { CommentGetSerialization } from './comment.get.serilization';
import { ApiProperty } from '@nestjs/swagger';

export class CommentListSerialization {
    @ApiProperty({})
    data: CommentGetSerialization[];
}
