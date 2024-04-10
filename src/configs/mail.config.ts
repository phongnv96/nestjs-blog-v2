import { registerAs } from '@nestjs/config';

export default registerAs(
    'mail',
    (): Record<string, any> => ({
            mailHost: process.env.MAIL_HOST,
            mailUser: process.env.MAIL_USER,
            mailPassword: process.env.MAIL_PASSWORD,
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN,
            accessToken: process.env.MAIL_ACCESS_TOKEN,
            keyFilePath: process.env.MAIL_KEY_FILEPATH,
    }),
);
