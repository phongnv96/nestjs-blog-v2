import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { TranslationDoc } from '../../translation/repository/entities/translation.entity';

export class PostCreateDto {
    @ApiHideProperty()
    readonly _id?: string;

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
        description: 'claps of post',
        example: faker.helpers.arrayElements([
            {
                author: faker.string.uuid(),
                clap: faker.number.int(),
            },
        ]),
        required: false,
    })
    @IsArray()
    @IsOptional()
    readonly claps?: {
        author: string;
        clap: number;
    }[];

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
    @Type(() => String)
    readonly thumbnail: string;

    @ApiProperty({
        description: 'number view of post',
        example: faker.number.int(),
    })
    @Type(() => String)
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
