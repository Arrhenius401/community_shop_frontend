import request from './request';

/**
 * 创建订单
 * @param {Object} params - 订单参数（与后端OrderCreateDTO对齐）
 * @param {Array<{productId: number, quantity: number}>} params.productList - 商品列表（必填）
 * @param {number} params.addressId - 收货地址ID（必填）
 * @param {string} [params.remark] - 订单备注
 * @param {string} [params.payType] - 支付方式（ALIPAY/WECHAT，默认担保交易）
 * @returns {Promise<OrderDetailDTO>} 创建后的订单详情（含支付链接）
 */
export const createOrder = (params) => {
  return request.post('/api/v1/orders/create', params);
};

/**
 * 订单支付回调（后端接收支付平台通知，前端无需调用）
 * @param {Object} params - 支付平台回调参数
 * @returns {Promise<string>} 回调响应（支付平台要求格式，如"success"）
 */
export const orderPayCallback = (params) => {
  return request.post('/api/v1/orders/pay/callback', params);
};

/**
 * 确认收货
 * @param {number} orderId - 订单ID（路径参数）
 * @returns {Promise<boolean>} 操作结果（true成功）
 */
export const confirmReceiveOrder = (orderId) => {
  return request.patch(`/api/v1/orders/${orderId}/receive`);
};

/**
 * 分页查询订单列表
 * @param {Object} params - 查询参数
 * @param {string} [params.status] - 订单状态（待支付/待发货/待收货/已完成/已取消）
 * @param {string} [params.startTime] - 开始时间（筛选）
 * @param {string} [params.endTime] - 结束时间（筛选）
 * @param {number} [params.pageNum] - 页码（默认1）
 * @param {number} [params.pageSize] - 每页条数（默认10）
 * @returns {Promise<PageResult<OrderListItemDTO>>} 分页订单列表
 */
export const getOrderList = (params) => {
  return request.get('/api/v1/orders/list', { params });
};