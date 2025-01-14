import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PaymentDoc } from '../repository/entities/payment.entity';
import { OrderService } from '../../order/services/order.service';
import { PaypalService } from './paypal.service';
import { PaymentRepository } from '../repository/repositories/payment.repository';
import { DirectPaymentDto } from '../dtos/direct-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderService: OrderService,
        private readonly paypalService: PaypalService
    ) {}

    async initiatePaypalPayment(
        orderId: string,
        userId: string
    ): Promise<{ paymentId: string }> {
        const order = await this.orderService.getOrderById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Verify order belongs to user
        if (order.userId !== userId) {
            throw new ForbiddenException('Not authorized to access this order');
        }

        try {
            const paypalOrderId = await this.paypalService.createOrder(
                order.totalAmount.toString(),
                order.items
            );

            const payment = await this.paymentRepository.create({
                orderId,
                userId,
                amount: order.totalAmount,
                paymentMethod: 'PAYPAL',
                status: 'PENDING',
                transactionId: paypalOrderId,
            });

            return { paymentId: payment.id };
        } catch (error) {
            throw new BadRequestException(
                'Failed to create PayPal order: ' + error.message
            );
        }
    }

    async completePaypalPayment(
        paymentId: string,
        userId: string
    ): Promise<PaymentDoc> {
        const payment = await this.paymentRepository.findOneById(paymentId);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Verify payment belongs to user
        if (payment.userId !== userId) {
            throw new ForbiddenException(
                'Not authorized to access this payment'
            );
        }

        try {
            const captureResult = await this.paypalService.capturePayment(
                payment.transactionId
            );

            if (captureResult.status === 'COMPLETED') {
                const captureId =
                    captureResult.purchaseUnits[0].payments.captures[0].id;
                return this.updatePaymentStatus(
                    paymentId,
                    'COMPLETED',
                    captureId
                );
            }

            return this.updatePaymentStatus(paymentId, 'FAILED');
        } catch (error) {
            await this.updatePaymentStatus(paymentId, 'FAILED');
            throw new BadRequestException(
                'Failed to capture PayPal payment: ' + error.message
            );
        }
    }

    async createPayment(paymentData: {
        orderId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
    }): Promise<PaymentDoc> {
        const order = await this.orderService.getOrderById(paymentData.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const payment = await this.paymentRepository.create({
            ...paymentData,
            status: 'PENDING',
        });

        return payment;
    }

    async updatePaymentStatus(
        paymentId: string,
        status: string,
        transactionId?: string
    ): Promise<PaymentDoc> {
        const payment = await this.paymentRepository.findOneById(paymentId);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        payment.status = status;
        if (status === 'COMPLETED') {
            payment.paidAt = new Date();
            payment.transactionId = transactionId;
            await this.orderService.updateOrderStatus(payment.orderId, 'PAID');
        }

        return this.paymentRepository.save(payment);
    }

    async initiateDirectPaypalPayment(
        userId: string,
        { items }: DirectPaymentDto
    ): Promise<{ paymentId: string }> {
        try {
            const order = await this.orderService.createOrder({
                userId,
                items,
                notes: 'Direct PayPal payment',
            });

            const paypalOrderId = await this.paypalService.createOrder(
                order.totalAmount.toString(),
                items
            );

            const payment = await this.paymentRepository.create({
                orderId: order._id,
                userId,
                amount: order.totalAmount,
                paymentMethod: 'PAYPAL',
                status: 'PENDING',
                transactionId: paypalOrderId,
            });

            return { paymentId: payment.id };
        } catch (error) {
            throw new BadRequestException(
                'Failed to create direct PayPal payment: ' + error.message
            );
        }
    }
}
