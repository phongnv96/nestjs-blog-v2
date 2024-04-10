import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateGithubSSODto {
    @ApiProperty({
        example: faker.string.alphanumeric(30),
        description: 'Will be valid SSO Token Encode string from github API',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly accessToken: string;

    @ApiProperty({
        example: faker.string.alphanumeric(30),
        description:
            'Will be valid SSO Secret Token Encode string from github API',
        required: true,
    })
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly refreshToken: string;
}
