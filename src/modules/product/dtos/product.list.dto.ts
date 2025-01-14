import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsNumber, ValidateNested } from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { TranslationEntity } from '../../../modules/translation/repository/entities/translation.entity';

export class ProductListDto {
    @ApiProperty({
        description: 'Unique identifier of the product',
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
        description: 'Product type',
        enum: ['SOFTWARE', 'EBOOK', 'VIDEO', 'AUDIO', 'COURSE', 'OTHER'],
    })
    @IsString()
    readonly type: string;

    @ApiProperty({
        description: 'Name of the product',
        example: 'E-book on NestJS',
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 19.99,
    })
    @IsNumber()
    readonly price: number;

    @ApiProperty({
        description: 'Categories associated with the product',
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    readonly categories: string[];

    @ApiProperty({ description: 'Thumbnail for the product' })
    @Type(() => String)
    readonly thumbnail: string;

    @ApiProperty({
        description: 'Product images',
        type: [AwsS3Serialization],
        required: false,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AwsS3Serialization)
    readonly images: AwsS3Serialization[];

    @ApiProperty({
        description: 'Product rating',
        example: 4.5,
    })
    @IsNumber()
    readonly rating: number;

    @ApiProperty({
        description: 'Number of ratings',
        example: 42,
    })
    @IsNumber()
    readonly ratingCount: number;

    @ApiProperty({
        description: 'Author information',
        type: Object,
    })
    readonly author: {
        _id: string;
        firstName: string;
        lastName: string;
    };

    @ApiProperty({
        description: 'Creation date',
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Last update date',
    })
    readonly updatedAt: Date;
}
