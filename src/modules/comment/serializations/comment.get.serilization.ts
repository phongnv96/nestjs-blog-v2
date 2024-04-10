import { CommentCreateDto } from '../dtos/comment.create.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
import { IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export class CommentGetSerialization extends OmitType(CommentCreateDto, [
    'author',
]) {
    @ApiProperty({
        description: 'author of comment',
        example: faker.name.firstName(),
    })
    readonly author: {
        firstName: string;
        lastName: string;
        photo: AwsS3Serialization;
    };

    @ApiProperty({
        description: 'photo of comment',
        example: faker.image.avatar(),
    })
    @Transform(({ value }) => (value ? dayjs(value).fromNow() : null))
    readonly createdAt: string;

    @ApiProperty({
        description: 'children of comment',
        type: () => [CommentGetSerialization],
        example: [
            {
                _id: faker.string.uuid(),
                content: faker.lorem.paragraphs(1),
                photo: [
                    {
                        path: faker.system.filePath(),
                        pathWithFilename: faker.system.filePath(),
                        filename: faker.system.fileName(),
                        completedUrl: faker.internet.url(),
                        baseUrl: faker.internet.url(),
                        mime: faker.system.mimeType(),
                    },
                ],
                post: faker.string.uuid(),
                children: [],
            },
        ],
    })
    @Type(() => CommentGetSerialization)
    @IsArray()
    readonly children: CommentGetSerialization[];
}
