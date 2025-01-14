import { ApiProperty } from '@nestjs/swagger';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export class ProductListSerialization {
    @ApiProperty({
        description: 'Unique identifier for the product',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    readonly id: string;

    @ApiProperty({
        description: 'Name of the product',
        example: 'Premium Software',
    })
    readonly name: string;

    @ApiProperty({
        description: 'Description of the product',
        example: 'A premium software package for professionals.',
    })
    readonly description: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 49.99,
    })
    readonly price: number;

    @ApiProperty({
        description: 'Array of categories associated with the product',
        example: ['Software', 'Tools'],
    })
    readonly categories: string[];

    @ApiProperty({
        description: 'Array of images for the product',
        type: [AwsS3Serialization],
    })
    readonly images: AwsS3Serialization[];

    @ApiProperty({
        description: 'Indicates whether the product is active',
        example: true,
    })
    readonly isActive: boolean;

    @ApiProperty({
        description: 'Rating of the product',
        example: 4.5,
    })
    readonly rating: number;

    @ApiProperty({
        description: 'Total number of ratings for the product',
        example: 128,
    })
    readonly ratingCount: number;

    @ApiProperty({
        description: 'Total number of downloads',
        example: 542,
    })
    readonly downloads: number;
}
