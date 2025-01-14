import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { PaymentInitiateResponse } from '../serializations/payment.serialization';

export function PaymentCreatePaypalDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create PayPal payment for order',
        }),
        DocAuth({
            jwtAccessToken: true,
            apiKey: true,
        }),
        DocResponse<PaymentInitiateResponse>('payment.createPaypal', {
            httpStatus: HttpStatus.CREATED,
            serialization: PaymentInitiateResponse,
        })
    );
}

export function PaymentCapturePaypalDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Capture PayPal payment',
        }),
        DocAuth({
            jwtAccessToken: true,
            apiKey: true,
        }),
        DocResponse('payment.capturePaypal', {
            httpStatus: HttpStatus.OK,
        })
    );
}
