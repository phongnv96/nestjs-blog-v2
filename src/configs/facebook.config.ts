import { registerAs } from '@nestjs/config';

export default registerAs(
    'facebook',
    (): Record<string, any> => ({
        clientId: process.env.SSO_FACEBOOK_APP_ID,
        clientSecret: process.env.SSO_FACEBOOK_CLIENT_SECRET,
        callbackSignUpUrl: process.env.SSO_FACEBOOK_CALLBACK_URL_SIGN_UP,
        callbackLoginUrl: process.env.SSO_FACEBOOK_CALLBACK_URL_LOGIN,
    })
);
