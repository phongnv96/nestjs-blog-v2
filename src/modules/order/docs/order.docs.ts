import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { OrderCreateDto, OrderUpdateDto } from '../dtos/order.dto';
import {
    OrderGetSerialization,
    OrderListSerialization,
} from '../serializations/order.serializations';

export function OrderCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new order',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            body: OrderCreateDto,
        }),
        DocResponse<ResponseIdSerialization>('order.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function OrderGetByIdDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get order details by ID',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse<OrderGetSerialization>('order.get', {
            serialization: OrderGetSerialization,
        })
    );
}

export function OrderListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get a list of all orders',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse<OrderListSerialization>('order.list', {
            serialization: OrderListSerialization,
        })
    );
}

export function OrderUpdateStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update the payment status of an order',
        }),
        DocAuth({
            apiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            body: OrderUpdateDto,
        }),
        DocResponse<ResponseIdSerialization>('order.update-status', {
            httpStatus: HttpStatus.OK,
            serialization: ResponseIdSerialization,
        })
    );
}
