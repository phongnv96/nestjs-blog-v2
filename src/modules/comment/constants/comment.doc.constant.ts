import { faker } from '@faker-js/faker';

export const CommentDocParamsId = [
    {
        name: 'postId',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];
