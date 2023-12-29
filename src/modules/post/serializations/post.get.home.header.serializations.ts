import { ApiProperty } from "@nestjs/swagger";
import { PostGetSerialization } from "./post.get.serializations";


export class PostGetHomeHeaderSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'feature of month',
        isArray: true,
    })
    featureOfMonth: PostGetSerialization[]

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'popular posts',
        isArray: true,
    })
    popularPost: PostGetSerialization[]

    @ApiProperty({
        description: 'top 10 tags posts',
        isArray: true,
    })
    tags: string[]
}