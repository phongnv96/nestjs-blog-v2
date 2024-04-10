import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsObject,
    IsOptional,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export class QuizCreateDto {
    @ApiProperty({
        description: 'path parentIds of Quiz',
        example: faker.person.jobTitle(),
    })
    @IsOptional()
    @Type(() => String)
    readonly path?: string;

    @ApiHideProperty()
    @Type(() => String)
    readonly slug?: string;

    @ApiProperty({
        description: 'title of Quiz',
        example: faker.person.jobTitle(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Type(() => String)
    readonly title: string;

    @ApiProperty({
        description: 'description of Quiz',
        example: faker.lorem.paragraphs(5),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly description: string;

    @ApiProperty({
        description: 'photo for Quiz',
    })
    @IsObject()
    @IsOptional()
    readonly photo?: AwsS3Serialization;
}
