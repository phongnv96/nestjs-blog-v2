import { Controller, Param, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import { IUserDoc } from 'src/modules/user/interfaces/user.interface';
import { PaymentService } from '../services/payment.service';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import {
    PaymentCreatePaypalDoc,
    PaymentCapturePaypalDoc,
} from '../docs/payment.auth.doc';
import { PaymentInitiateResponse } from '../serializations/payment.serialization';
import { DirectPaymentDto } from '../dtos/direct-payment.dto';

@ApiTags('modules.auth.payment')
@Controller({
    version: '1',
    path: '/payment',
})
export class PaymentAuthController {
    constructor(private readonly paymentService: PaymentService) {}

    @PaymentCreatePaypalDoc()
    @Response('payment.createPaypal', {
        serialization: PaymentInitiateResponse,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAccessProtected()
    @Post('/paypal/create/:orderId')
    async createPaypalPayment(
        @GetUser() user: IUserDoc,
        @Param('orderId') orderId: string
    ) {
        return this.paymentService.initiatePaypalPayment(orderId, user._id);
    }

    @PaymentCreatePaypalDoc()
    @Response('payment.createDirectPaypal', {
        serialization: PaymentInitiateResponse,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAccessProtected()
    @Post('/paypal/create')
    async createDirectPaypalPayment(
        @GetUser() user: IUserDoc,
        @Body() directPaymentDto: DirectPaymentDto
    ) {
        return this.paymentService.initiateDirectPaypalPayment(
            user._id,
            directPaymentDto
        );
    }

    @PaymentCapturePaypalDoc()
    @Response('payment.capturePaypal')
    @ApiKeyPublicProtected()
    @AuthJwtAccessProtected()
    @Post('/paypal/capture/:paymentId')
    async capturePaypalPayment(
        @GetUser() user: IUserDoc,
        @Param('paymentId') paymentId: string
    ) {
        return this.paymentService.completePaypalPayment(paymentId, user._id);
    }
}
