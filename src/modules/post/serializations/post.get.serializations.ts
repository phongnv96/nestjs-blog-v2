import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { CategoryGetSerialization } from 'src/modules/category/serializations/category.get.serialization';
import { TranslationGetSerialization } from 'src/modules/translation/serializations/translation.get.serilizations';

class AuthorGetSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'id of user',
        example: faker.string.uuid(),
    })
    readonly _id: string;
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'first name of user',
        example: faker.person.firstName(),
    })
    readonly firstName: string;
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'title of post',
        example: faker.person.lastName(),
    })
    readonly lastName: string;
}
export class PostGetPermissionSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'title of post',
        example: faker.person.jobTitle(),
    })
    readonly title: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'author of post',
    })
    readonly author: AuthorGetSerialization;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'photo of post',
    })
    readonly photo: AwsS3Serialization;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'translation of post',
        isArray: true,
    })
    readonly translation: TranslationGetSerialization[];

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'categories of post',
        isArray: true,
    })
    readonly categories: CategoryGetSerialization[];
}

export class PostGetSerialization extends PostGetPermissionSerialization {
    @ApiProperty({
        description: 'Id that representative with your target data',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly _id: string;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly updatedAt: Date;

    @ApiHideProperty()
    @Exclude()
    readonly deletedAt?: Date;
}
