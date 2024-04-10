import { registerAs } from '@nestjs/config';

export default registerAs(
    'client',
    (): Record<string, any> => ({
        domain: process.env.SSO_CLIENT_DOMAIN,
        loginSuccessUrl: process.env.SSO_CLIENT_LOGIN_SUCCESS_URL,
    })
);
