import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class TranslationCreateDto {
    @ApiProperty({
        description: 'title of post',
        example: faker.person.jobTitle(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Type(() => String)
    readonly title: string;

    @ApiProperty({
        description: 'content of post',
        example: faker.lorem.paragraphs(5),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly content: string;

    @ApiProperty({
        description: 'description of post',
        example: faker.lorem.paragraphs(5),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly description: string;

    @ApiProperty({
        description: 'language of post',
        example: faker.location.countryCode(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly language: string;

    @ApiProperty({
        description: 'time to read of post',
        example: faker.number.int({ min: 0, max: 10 }),
        required: true,
    })
    @Type(() => Number)
    readonly timeToRead: number;
}
