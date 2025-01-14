import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";

export class TranslationGetSerialization {

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'id of translation language',
        example: faker.string.uuid(),
    })
    _id: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'language of translation language',
        example: faker.location.countryCode(),
    })
    language: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'title of translation language',
        example: faker.person.jobTitle(),
    })
    title: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'description of translation language',
        example: faker.commerce.productDescription(),
    })
    description: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'translation of translation language',
    })
    slug: string;
}