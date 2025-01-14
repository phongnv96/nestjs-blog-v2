import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const PRODUCT_DEFAULT_ORDER_BY = 'createdAt';
export const PRODUCT_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const PRODUCT_DEFAULT_PER_PAGE = 20;
export const PRODUCT_DEFAULT_AVAILABLE_SEARCH = ['name', 'categories', 'type'];
export const PRODUCT_DEFAULT_AVAILABLE_ORDER_BY = [
    'name',
    'price',
    'createdAt',
];
export const PRODUCT_DEFAULT_IS_ACTIVE = [true, false];
