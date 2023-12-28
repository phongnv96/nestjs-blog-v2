import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { string } from 'yargs';
import { TranslationDoc } from '../repository/entities/translation.entity';

export class PostCreateDto {

    @ApiHideProperty()
    readonly _id ?: string

    @ApiProperty({
        description: 'author id',
        example: faker.string.uuid(),
    })
    readonly author: string;

    @ApiProperty({
        description: 'tags for search',
        example: faker.helpers.arrayElements(['nextjs', 'reactjs', 'angular']),
        required: true,
    })
    @IsArray()
    readonly tags: string[];

    @ApiProperty({
        description: 'categories of post',
        example: faker.helpers.arrayElements([
            faker.string.uuid(),
            faker.string.uuid(),
            faker.string.uuid(),
        ]),
        required: true,
    })
    @IsArray()
    readonly categories: string[];

    @ApiProperty({
        description: 'thumbnail for small image',
        example: faker.image.avatar(),
    })
    @Type(() => string)
    readonly thumbnail: string;

    @ApiProperty({
        description: 'number view of post',
        example: faker.number.int(),
    })
    @Type(() => string)
    readonly view?: string;

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
    readonly translations: TranslationDoc[];
}
