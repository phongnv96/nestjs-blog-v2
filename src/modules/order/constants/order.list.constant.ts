import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const ORDER_DEFAULT_ORDER_BY = 'orderDate';
export const ORDER_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const ORDER_DEFAULT_PER_PAGE = 10;
export const ORDER_DEFAULT_AVAILABLE_ORDER_BY = ['orderDate', 'totalAmount'];
export const ORDER_DEFAULT_AVAILABLE_SEARCH = ['userId', 'paymentStatus'];
export const ORDER_DEFAULT_IS_ACTIVE = [true, false];
