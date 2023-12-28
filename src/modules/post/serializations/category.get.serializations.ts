import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { AwsS3Serialization } from "src/common/aws/serializations/aws.s3.serialization";

export class CategoryGetSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        description: 'title of category',
        example: faker.person.jobTitle(),
    })
    readonly title: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'title of category',
        example: faker.person.jobDescriptor(),
    })
    readonly description: string;

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'parentId of category',
        example: faker.string.uuid()
    })
    readonly parentId: string;

    @ApiProperty({
        required: true,
        description: 'photo of category',
    })
    readonly photo?: AwsS3Serialization;

    @ApiProperty({
        description: 'children of category',
        isArray: true,
        type: () => CategoryGetSerialization
    })
    readonly children?: CategoryGetSerialization[];

    @ApiProperty({
        required: true,
        nullable: false,
        description: 'number post of category',
        example: faker.number.int()
    })
    readonly postCount: number;
}