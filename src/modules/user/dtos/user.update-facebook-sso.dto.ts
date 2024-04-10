import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateFacebookSSODto {
    @ApiProperty({
        example: faker.string.alphanumeric(30),
        description: 'Will be valid SSO Token Encode string from facebook API',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly accessToken: string;

    @ApiProperty({
        example: faker.string.alphanumeric(30),
        description:
            'Will be valid SSO Secret Token Encode string from facebook API',
    })
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly refreshToken: string;
}
