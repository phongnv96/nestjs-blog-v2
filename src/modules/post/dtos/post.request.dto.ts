import { IsNotEmpty, IsString } from 'class-validator';

export class PostRequestDto {
    @IsNotEmpty()
    @IsString()
    slug: string;
}
