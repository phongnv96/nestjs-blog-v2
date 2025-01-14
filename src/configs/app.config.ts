import { version } from 'package.json';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

import { registerAs } from '@nestjs/config';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        name: process.env.APP_NAME ?? 'ack',
        env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,

        repoVersion: version,
        versioning: {
            enable: process.env.HTTP_VERSIONING_ENABLE === 'true' || false,
            prefix: 'v',
            version: process.env.HTTP_VERSION ?? '1',
        },

        globalPrefix: '/api',
        http: {
            enable: process.env.HTTP_ENABLE === 'true' || false,
            host: process.env.HTTP_HOST ?? 'localhost',
            port: process.env.HTTP_PORT
                ? Number.parseInt(process.env.HTTP_PORT)
                : 3000,
        },

        throttle: {
            enable: process.env.THROTTLE_ENABLE === 'true' || false,
            ttl: Number.parseInt(process.env.THROTTLE_TTL ?? '60000'),
            limit: Number.parseInt(process.env.THROTTLE_LIMIT ?? '100'),
        },

        jobEnable: process.env.JOB_ENABLE === 'true' || false,
    })
);
