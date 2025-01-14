import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CheckoutPaymentIntent,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} from '@paypal/paypal-server-sdk';
import { OrderItemDto } from 'src/modules/order/dtos/order.dto';

@Injectable()
export class PaypalService {
    private client: Client;
    private ordersController: OrdersController;

    constructor(private readonly configService: ConfigService) {
        const clientId = this.configService.get('payment.clientId');
        const clientSecret = this.configService.get('payment.clientSecret');
        const mode = this.configService.get('payment.mode');

        this.client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: clientId,
                oAuthClientSecret: clientSecret,
            },
            timeout: 0,
            environment:
                mode === 'Production'
                    ? Environment.Production
                    : Environment.Sandbox,
            logging: {
                logLevel: LogLevel.Info,
                logRequest: { logBody: true },
                logResponse: { logHeaders: true },
            },
        });
        this.ordersController = new OrdersController(this.client);
    }

    async createOrder(
        amount: string,
        orderItems: OrderItemDto[],
        currency = 'USD'
    ): Promise<string> {
        try {
            const collect = {
                body: {
                    intent: CheckoutPaymentIntent.Capture,
                    purchaseUnits: [
                        {
                            amount: {
                                currencyCode: currency,
                                value: amount,
                                breakdown: {
                                    itemTotal: {
                                        currencyCode: currency,
                                        value: amount,
                                    },
                                },
                            },
                            items: orderItems.map((item) => ({
                                name: item.productId,
                                unitAmount: {
                                    currencyCode: currency,
                                    value: item.price.toFixed(2),
                                },
                                quantity: item.quantity.toString(),
                            })),
                        },
                    ],
                },
                prefer: 'return=minimal',
            };
            const result = await this.ordersController.ordersCreate(collect);
            return result.result.id;
        } catch (error) {
            throw new BadRequestException(
                `PayPal createOrder error: ${error.message}`
            );
        }
    }

    async capturePayment(orderId: string) {
        try {
            const collect = {
                id: orderId,
                prefer: 'return=minimal',
            };
            const response = await this.ordersController.ordersCapture(collect);
            return response.result;
        } catch (error) {
            throw new BadRequestException(
                `PayPal capturePayment error: ${error.message}`
            );
        }
    }

    async getOrder(orderId: string) {
        try {
            const response = await this.ordersController.ordersGet({
                id: orderId,
            });
            return response.result;
        } catch (error) {
            throw new BadRequestException(
                `PayPal getOrder error: ${error.message}`
            );
        }
    }
}
