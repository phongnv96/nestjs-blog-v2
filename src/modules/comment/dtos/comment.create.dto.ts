import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    IsArray,
    IsMongoId,
    IsEnum,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ENUM_COMMENT_REFERENCE_TYPE } from '../constants/comment.enum.constant';

export class CommentCreateDto {
    @ApiHideProperty()
    readonly author?: string;

    @IsNotEmpty()
    @IsMongoId()
    reference: string;

    @IsNotEmpty()
    @IsEnum(ENUM_COMMENT_REFERENCE_TYPE)
    referenceType: ENUM_COMMENT_REFERENCE_TYPE;

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

    @ApiProperty({
        description: 'user likes id',
    })
    @IsArray()
    @IsOptional()
    readonly likes?: string[];
}
