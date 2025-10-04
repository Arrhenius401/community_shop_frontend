import request from './request';
import type {
  OrderCreateParams,
  OrderDetail,
  OrderPayParams,
  PayCallbackParams,
  OrderStatusUpdateParams,
  OrderShipParams,
  OrderQueryParams,
  OrderListPageResult
} from '@/types/order';

/**
 * 创建订单（对应后端 POST /api/v1/orders/create，需登录）
 * @param params 订单创建参数（与后端 OrderCreateDTO 对齐）
 * @returns 订单详情（含订单号、支付信息）
 */
export const createOrder = (params: OrderCreateParams) => {
  return request.post<OrderDetail>('/api/v1/orders/create', params);
};

/**
 * 订单支付（对应后端 POST /api/v1/orders/{orderId}/pay，需登录）
 * @param orderId 订单ID（路径参数）
 * @param params 支付参数（与后端 OrderPayDTO 对齐，含金额校验）
 * @returns 支付结果（含第三方支付跳转链接或支付流水号）
 */
export const payOrder = (orderId: number, params: OrderPayParams) => {
  return request.post<{ payUrl?: string; payNo: string }>(`/api/v1/orders/${orderId}/pay`, params);
};

/**
 * 获取订单详情（对应后端 GET /api/v1/orders/{orderId}，需登录）
 * @param orderId 订单ID（路径参数）
 * @returns 订单完整信息（与后端 OrderDetailDTO 对齐）
 */
export const getOrderDetail = (orderId: number) => {
  return request.get<OrderDetail>(`/api/v1/orders/${orderId}`);
};

/**
 * 订单状态更新（如确认收货、取消订单，对应后端 PATCH /api/v1/orders/{orderId}/status，需登录）
 * @param orderId 订单ID（路径参数）
 * @param params 状态更新参数（与后端 OrderStatusUpdateDTO 对齐，含操作人ID）
 * @returns 操作结果（true=成功）
 */
export const updateOrderStatus = (orderId: number, params: OrderStatusUpdateParams) => {
  return request.patch<boolean>(`/api/v1/orders/${orderId}/status`, params);
};

/**
 * 卖家发货（对应后端 POST /api/v1/orders/{orderId}/ship，需登录且为卖家）
 * @param orderId 订单ID（路径参数）
 * @param params 发货参数（与后端 OrderShipDTO 对齐，含快递公司、物流单号）
 * @returns 操作结果（true=成功）
 */
export const shipOrder = (orderId: number, params: OrderShipParams) => {
  return request.post<boolean>(`/api/v1/orders/${orderId}/ship`, params);
};

/**
 * 查询订单列表（买家/卖家/管理员视角，对应后端 GET /api/v1/orders/list，需登录）
 * @param params 订单查询参数（与后端 OrderQueryDTO 对齐，含操作人类型、分页）
 * @returns 分页订单列表
 */
export const queryOrderList = (params: OrderQueryParams) => {
  return request.get<OrderListPageResult>('/api/v1/orders/list', { params });
};

/**
 * 支付回调通知（后端接收第三方支付平台回调，前端无需主动调用）
 * @param params 支付回调参数（与后端 PayCallbackDTO 对齐）
 * @returns 回调响应（第三方平台要求格式，如 "success"）
 */
export const payCallback = (params: PayCallbackParams) => {
  return request.post<string>('/api/v1/orders/pay/callback', params);
};