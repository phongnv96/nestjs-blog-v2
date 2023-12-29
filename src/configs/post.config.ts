import { registerAs } from '@nestjs/config';

export default registerAs(
    'post',
    (): Record<string, any> => ({
        uploadPath: '/post',
    })
);
