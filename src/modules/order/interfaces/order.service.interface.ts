
import { OrderDoc } from '../repository/entities/order.entity';
import { OrderCreateDto } from '../dtos/order.dto';
import { IDatabaseFindAllOptions, IDatabaseGetTotalOptions } from 'src/common/database/interfaces/database.interface';

export interface IOrderService {
    createOrder(orderCreateDto: OrderCreateDto): Promise<OrderDoc>;
    updateOrderStatus(orderId: string, paymentStatus: string): Promise<OrderDoc>;
    getOrderForUser(orderId: string, userId: string): Promise<OrderDoc>;
    getTotalOrders(findOptions?: Record<string, any>): Promise<number>;
    getAllOrders(
        findOptions?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<OrderDoc[]>;
    getOrdersByUser(
        userId: string,
        options?: IDatabaseFindAllOptions
    ): Promise<OrderDoc[]>;
}
