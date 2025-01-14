import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { OrderCreateDto, OrderItemDto } from '../dtos/order.dto';
import { OrderDoc } from '../repository/entities/order.entity';
import { IPaginationOrder } from 'src/common/pagination/interfaces/pagination.interface';
import { IOrderService } from '../interfaces/order.service.interface';
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';
import { OrderItemRepository } from '../repository/order.item.repository';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository
    ) {}

    async createOrder(orderCreateDto: OrderCreateDto): Promise<OrderDoc> {
        const { userId, items, notes } = orderCreateDto;

        // Calculate total amount
        const totalAmount = items.reduce(
            (sum, item) =>
                sum + item.price * item.quantity - (item.discount || 0),
            0
        );

        // Create order items in the database
        const orderItems = await Promise.all(
            items.map(async (item) =>
                this.orderItemRepository.create({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount,
                })
            )
        );

        // Create the order in the database
        const order = await this.orderRepository.create({
            userId,
            orderDate: new Date(),
            totalAmount,
            items: orderItems.map((item) => item._id),
            notes,
        });

        return order;
    }

    async updateOrderStatus(
        orderId: string,
        paymentStatus: string
    ): Promise<OrderDoc> {
        const order = await this.orderRepository.findOneById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.paymentStatus = paymentStatus;
        return this.orderRepository.save(order);
    }

    async getOrderById(
        orderId: string
    ): Promise<OrderDoc & { items: Array<OrderItemDto> }> {
        return (await this.orderRepository.findOneById(orderId)).populate({
            path: 'items',
            model: 'order_items',
        });
    }

    async getAllOrders(
        findOptions: { $text: { $search: string } } | { $text?: undefined },
        p0: {
            paging: { limit: number; offset: number };
            order: IPaginationOrder;
        }
    ): Promise<OrderDoc[]> {
        return this.orderRepository.findAll(findOptions, p0);
    }

    async getOrderForUser(orderId: string, userId: string): Promise<OrderDoc> {
        const order = await this.orderRepository.findOne({
            _id: orderId,
            userId: userId, // Ensure the order belongs to the user
        });

        if (!order) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Order not found or does not belong to the user.',
            });
        }

        return order;
    }

    async getOrdersByUser(
        userId: string,
        options?: IDatabaseFindAllOptions
    ): Promise<OrderDoc[]> {
        const findOptions = { userId }; // Filter by userId
        return this.orderRepository.findAll(findOptions, options);
    }

    async getTotalOrders(
        findOptions: Record<string, any> = {}
    ): Promise<number> {
        return this.orderRepository.getTotal(findOptions);
    }
}
