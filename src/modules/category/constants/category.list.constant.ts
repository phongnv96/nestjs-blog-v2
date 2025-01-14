import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const CATEGORY_DEFAULT_ORDER_BY = 'createdAt';
export const CATEGORY_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const CATEGORY_DEFAULT_PER_PAGE = 10;
export const CATEGORY_DEFAULT_AVAILABLE_ORDER_BY = [
    'name',
    'type',
    'createdAt',
];
export const CATEGORY_DEFAULT_AVAILABLE_SEARCH = [
    'name',
    'description',
    'type',
];
