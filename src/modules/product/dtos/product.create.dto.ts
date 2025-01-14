import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsEnum,
    IsArray,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { TranslationCreateDto } from 'src/modules/translation/dtos/translation.create.dto';

export class ProductCreateDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TranslationCreateDto)
    translations: TranslationCreateDto[];

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsEnum(['SOFTWARE', 'EBOOK', 'VIDEO', 'AUDIO', 'COURSE', 'OTHER'])
    @IsNotEmpty()
    type: string;

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    categories: string[];

    @IsOptional()
    @Type(() => AwsS3Serialization)
    downloadUrl?: AwsS3Serialization;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AwsS3Serialization)
    images?: AwsS3Serialization[];

    @IsNotEmpty()
    @IsString()
    author: Types.ObjectId;
}
