import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { TranslationEntity } from 'src/modules/translation/repository/entities/translation.entity';

export class ProductGetDto {
    @ApiProperty({
        description: 'Unique identifier of the product',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    readonly _id: string;

    @ApiProperty({
        description: 'Array of translations for the product',
        type: [TranslationEntity],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TranslationEntity)
    readonly translations: TranslationEntity[];

    @ApiProperty({
        description: 'Type of the product',
        example: 'SOFTWARE',
        enum: ['SOFTWARE', 'EBOOK', 'VIDEO', 'AUDIO', 'COURSE', 'OTHER'],
    })
    @IsString()
    readonly type: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 49.99,
    })
    @IsNumber()
    readonly price: number;

    @ApiProperty({
        description: 'Categories associated with the product',
        example: ['Software', 'Productivity'],
    })
    @IsArray()
    @IsString({ each: true })
    readonly categories: string[];

    @ApiProperty({
        description: 'Download URL for the product',
        type: AwsS3Serialization,
    })
    @ValidateNested()
    @Type(() => AwsS3Serialization)
    readonly downloadUrl: AwsS3Serialization;

    @ApiProperty({
        description: 'Array of product images',
        type: [AwsS3Serialization],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AwsS3Serialization)
    readonly images: AwsS3Serialization[];

    @ApiProperty({
        description: 'Number of downloads',
        example: 542,
    })
    @IsNumber()
    readonly downloads: number;

    @ApiProperty({
        description: 'Product rating',
        example: 4.5,
    })
    @IsNumber()
    readonly rating: number;

    @ApiProperty({
        description: 'Number of ratings received',
        example: 128,
    })
    @IsNumber()
    readonly ratingCount: number;

    @ApiProperty({
        description: 'Product version',
        example: '2.1.0',
    })
    @IsString()
    readonly version: string;

    @ApiProperty({
        description: 'Product metadata',
        example: { platform: 'Windows', size: '500MB' },
    })
    @IsOptional()
    readonly metadata?: Record<string, string>;

    @ApiProperty({
        description: 'Whether the product is active',
        example: true,
    })
    @IsBoolean()
    readonly isActive: boolean;

    @ApiProperty({
        description: 'Product author ID',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString()
    readonly author: string;

    @ApiProperty({
        description: 'Creation timestamp',
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
    })
    readonly updatedAt: Date;
}
