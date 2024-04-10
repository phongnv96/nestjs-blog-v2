import { registerAs } from '@nestjs/config';

export default registerAs(
    'google',
    (): Record<string, any> => ({
        clientId: process.env.SSO_GOOGLE_CLIENT_ID,
        clientSecret: process.env.SSO_GOOGLE_CLIENT_SECRET,
        callbackSignUpUrl: process.env.SSO_GOOGLE_CALLBACK_URL_SIGN_UP,
        callbackLoginUrl: process.env.SSO_GOOGLE_CALLBACK_URL_LOGIN,
        gcpBucketName: process.env.GCP_STORAGE_BUCKET_NAME,
        gcpKeyFilePath: process.env.GCP_STORAGE_KEY_FILEPATH,
        gcpBaseUrl: process.env.GCP_STORAGE_BASE_URL,

    })
);
