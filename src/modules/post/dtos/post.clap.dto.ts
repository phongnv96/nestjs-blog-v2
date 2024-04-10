import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { TranslationDoc } from '../repository/entities/translation.entity';

export class PostClapDto {
    @ApiProperty({
        description: 'post id',
        example: faker.string.uuid(),
        required: true,
    })
    readonly _id ?: string

    @ApiProperty({
        description: 'number view of claps',
        example: faker.number.int(),
    })
    readonly clap?: string;
}
