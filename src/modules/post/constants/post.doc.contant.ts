import { faker } from "@faker-js/faker";

export const PostDocParamsId = [
    {
        name: 'post',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];