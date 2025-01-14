import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class PostClapDto {
    @ApiProperty({
        description: 'post id',
        example: faker.string.uuid(),
        required: true,
    })
    readonly _id?: string;

    @ApiProperty({
        description: 'number view of claps',
        example: faker.number.int(),
    })
    readonly clap?: string;
}
