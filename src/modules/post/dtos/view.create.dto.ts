import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ViewCreateDto {
    @ApiProperty({
        description: 'ip of user',
        example: faker.internet.ipv4(),
    })
    @IsString()
    @MaxLength(200)
    @Type(() => String)
    readonly ipAddress: string;

    @ApiProperty({
        description: 'postId of post',
        example: faker.string.uuid(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly postId: string;

    @ApiProperty({
        description: 'userId if exist',
        example: faker.string.uuid(),
    })
    @IsString()
    @Type(() => String)
    readonly userId: string;
}
