import { IsNotEmpty, IsString } from 'class-validator';

export class PostRequestDto {
    @IsNotEmpty()
    @IsString()
    slug: string;
}

export class PostByIdRequestDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}
