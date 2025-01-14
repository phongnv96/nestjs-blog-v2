import { registerAs } from '@nestjs/config';

export default registerAs(
    'payment',
    (): Record<string, any> => ({
        paypal: {
            clientId: process.env.PAYMENT_PAYPAL_CLIENT_ID,
            clientSecret: process.env.PAYMENT_PAYPAL_CLIENT_SECRET,
            mode: process.env.PAYMENT_PAYPAL_MODE,
        },
    })
);
