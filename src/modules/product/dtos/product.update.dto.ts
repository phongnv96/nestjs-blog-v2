import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ProductCreateDto } from './product.create.dto';
import { Type } from 'class-transformer';
import { TranslationUpdateDto } from 'src/modules/translation/dtos/translation.update.dto';

export class ProductUpdateDto extends PartialType(ProductCreateDto) {
    @ApiProperty({
        description: 'Unique identifier of the product',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    readonly id: string;

    @ApiProperty({
        description: 'Name of the product',
        example: 'Updated Product Name',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly name?: string;

    @ApiProperty({
        description: 'Description of the product',
        example: 'Updated product description.',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 79.99,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    readonly price?: number;

    @ApiProperty({
        description: 'Array of categories associated with the product',
        example: ['Software', 'Ebooks'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    readonly categories?: string[];

    @ApiProperty({
        description: 'Indicates whether the product is active',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    readonly isActive?: boolean;

    @ApiProperty({
        description: 'Array of images for the product',
        type: [AwsS3Serialization],
        required: false,
    })
    @IsOptional()
    @IsArray()
    readonly images?: AwsS3Serialization[];

    @ApiProperty({
        description: 'Version of the product',
        example: '2.0.1',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly version?: string;

    @ApiProperty({
        description: 'Additional metadata for the product',
        example: { platform: 'Windows', size: '500MB' },
        required: false,
    })
    @IsOptional()
    readonly metadata?: Record<string, string>;

    @ApiProperty({
        description: 'Array of translations for the product',
        type: [TranslationUpdateDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TranslationUpdateDto)
    readonly translations?: TranslationUpdateDto[];
}
