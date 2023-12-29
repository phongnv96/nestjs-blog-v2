import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { string } from 'yargs';
import { TranslationCreateDto } from './translation.create.dto';
import { CategoryCreateDto } from './category.create.dto';

export class PostListDto {
    @ApiProperty({
        description: 'author id',
        example: faker.string.uuid(),
    })
    readonly author: {
        firstName: string;
        lastName: string;
    };

    @ApiProperty({
        description: 'tags for search',
        example: faker.helpers.arrayElements(['nextjs', 'reactjs', 'angular']),
        required: true,
    })
    @IsArray()
    readonly tags: string[];

    @ApiProperty({
        description: 'categories for search',
    })
    @IsArray()
    readonly categories?: CategoryCreateDto[];

    @ApiProperty({
        description: 'thumbnail for small image',
        // example: faker.image.avatar(),
        // required: true,
    })
    @Type(() => string)
    readonly thumbnail: string;

    @ApiProperty({
        description: 'photo for small image',
        // example: faker.image.avatar(),
        required: true,
    })
    @IsObject()
    readonly photo: AwsS3Serialization;

    @ApiProperty({
        description: 'content of post for translation',
        required: true,
    })
    @IsArray()
    readonly translations: TranslationCreateDto[];
}
