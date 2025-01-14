import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import {
    AuthJwtAdminAccessProtected,
    AuthJwtUserAccessProtected,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { OrderService } from '../services/order.service';
import { OrderCreateDto, OrderUpdateDto } from '../dtos/order.dto';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import {
    OrderGetSerialization,
    OrderListSerialization,
} from '../serializations/order.serializations';
import {
    ORDER_DEFAULT_PER_PAGE,
    ORDER_DEFAULT_ORDER_BY,
    ORDER_DEFAULT_ORDER_DIRECTION,
    ORDER_DEFAULT_AVAILABLE_SEARCH,
    ORDER_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/order.list.constant';

@ApiTags('modules.auth.order')
@Controller({
    version: '1',
    path: '/order',
})
export class OrderAuthController {
    constructor(private readonly orderService: OrderService) {}

    @Response('order.create', {
        serialization: OrderGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtUserAccessProtected()
    @Post('/create')
    async create(
        @Body() orderCreateDto: OrderCreateDto,
        @GetUser() user: UserDoc
    ) {
        const userId = user._id;
        return this.orderService.createOrder({ ...orderCreateDto, userId });
    }

    @Response('order.update', {
        serialization: OrderGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ORDER,
        action: [ENUM_POLICY_ACTION.UPDATE],
    })
    @Patch('/update-status/:id')
    async updateStatus(
        @Param('id') id: string,
        @Body() orderUpdateDto: OrderUpdateDto
    ) {
        return this.orderService.updateOrderStatus(
            id,
            orderUpdateDto.paymentStatus
        );
    }

    @Response('order.get', {
        serialization: OrderGetSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtUserAccessProtected()
    @Get('/get/:id')
    async getOrderForUser(@Param('id') id: string, @GetUser() user: UserDoc) {
        const userId = user._id;
        return this.orderService.getOrderForUser(id, userId);
    }

    @ResponsePaging('order.list', {
        serialization: OrderListSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async listAllOrders(
        @PaginationQuery(
            ORDER_DEFAULT_PER_PAGE,
            ORDER_DEFAULT_ORDER_BY,
            ORDER_DEFAULT_ORDER_DIRECTION,
            ORDER_DEFAULT_AVAILABLE_SEARCH,
            ORDER_DEFAULT_AVAILABLE_ORDER_BY
        )
        paginationQuery: PaginationListDto,
        @Query('search') search: string
    ) {
        const { _limit, _offset, _order } = paginationQuery;

        const findOptions = search ? { $text: { $search: search } } : {};

        const orders = await this.orderService.getAllOrders(findOptions, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });

        const total = await this.orderService.getTotalOrders(findOptions);
        const totalPage = Math.ceil(total / _limit);

        return {
            _pagination: { total, totalPage },
            data: orders,
        };
    }

    @ResponsePaging('order.list.user', {
        serialization: OrderListSerialization,
    })
    @ApiKeyPublicProtected()
    @AuthJwtUserAccessProtected()
    @Get('/list/user')
    async listUserOrders(
        @PaginationQuery(
            ORDER_DEFAULT_PER_PAGE,
            ORDER_DEFAULT_ORDER_BY,
            ORDER_DEFAULT_ORDER_DIRECTION,
            ORDER_DEFAULT_AVAILABLE_SEARCH,
            ORDER_DEFAULT_AVAILABLE_ORDER_BY
        )
        paginationQuery: PaginationListDto,
        @GetUser() user: UserDoc
    ) {
        const { _limit, _offset, _order } = paginationQuery;
        const userId = user._id;

        const orders = await this.orderService.getOrdersByUser(userId, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });

        const total = await this.orderService.getTotalOrders({ userId });
        const totalPage = Math.ceil(total / _limit);

        return {
            _pagination: { total, totalPage },
            data: orders,
        };
    }
}
