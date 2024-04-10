import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    IsArray,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
export class CommentCreateDto {
    @ApiHideProperty()
    readonly author?: string;

    @ApiProperty({
        description: 'post id of comment',
        // example: faker.string.uuid(),
        example: 'd9da6dc7-b097-45db-b36e-95c2585bfb22',
    })
    @IsNotEmpty()
    @Type(() => String)
    readonly post: string;

    @ApiProperty({
        description: 'thumbnail id of comment',
        example: `${faker.internet.url()}/${faker.system.filePath()}`,
    })
    @Type(() => String)
    @IsOptional()
    readonly thumbnail?: string;

    @ApiProperty({
        description: 'parentId id of comment',
        example: faker.string.uuid(),
    })
    @IsOptional()
    readonly parentId?: string;

    @ApiProperty({
        description: 'description of comment',
        example: faker.lorem.paragraphs(1),
        required: true,
    })
    @MaxLength(500)
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly content: string;

    @ApiProperty({
        description: 'photo for comment',
    })
    @IsArray()
    @IsOptional()
    readonly photo?: AwsS3Serialization[];
}
