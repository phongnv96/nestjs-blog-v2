import { registerAs } from '@nestjs/config';

export default registerAs(
    'github',
    (): Record<string, any> => ({
        clientId: process.env.SSO_GITHUB_CLIENT_ID,
        clientSecret: process.env.SSO_GITHUB_CLIENT_SECRET,
        callbackSignUpUrl: process.env.SSO_GITHUB_CALLBACK_URL_SIGN_UP,
        callbackLoginUrl: process.env.SSO_GITHUB_CALLBACK_URL_LOGIN,
    })
);
