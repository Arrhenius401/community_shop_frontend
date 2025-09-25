import request from './request';

/**
 * 发送私信
 * @param {Object} params - 私信参数（与后端MessageSendDTO对齐）
 * @param {number} params.receiverId - 接收人ID（必填）
 * @param {string} params.title - 消息标题（可选）
 * @param {string} params.content - 消息内容（必填，500字以内）
 * @param {number} [params.orderId] - 关联订单ID（订单相关消息必填）
 * @returns {Promise<number>} 消息ID
 */
export const sendPrivateMessage = (params) => {
  return request.post('/api/v1/messages/private', params);
};

/**
 * 获取消息详情
 * @param {number} msgId - 消息ID（路径参数）
 * @returns {Promise<MessageDetailDTO>} 消息详情（含发送人、内容、关联订单等）
 */
export const getMessageDetail = (msgId) => {
  return request.get(`/api/v1/messages/${msgId}`);
};

/**
 * 标记消息已读
 * @param {number} msgId - 消息ID（路径参数）
 * @returns {Promise<boolean>} 操作结果（true成功）
 */
export const markMessageAsRead = (msgId) => {
  return request.patch(`/api/v1/messages/${msgId}/read`);
};

/**
 * 分页查询消息列表
 * @param {Object} params - 查询参数（与后端MessageQueryDTO对齐）
 * @param {string} [params.type] - 消息类型（ORDER-订单通知，SYSTEM-系统公告，AFTER_SALE-售后提醒）
 * @param {string} [params.status] - 消息状态（UNREAD-未读，READ-已读）
 * @param {string} [params.keyword] - 关键词搜索（内容/标题）
 * @param {number} [params.pageNum] - 页码（默认1）
 * @param {number} [params.pageSize] - 每页条数（默认10）
 * @returns {Promise<PageResult<MessageListItemDTO>>} 分页消息列表
 */
export const getMessageList = (params) => {
  return request.get('/api/v1/messages/list', { params });
};

/**
 * 统计未读消息数
 * @returns {Promise<MessageStatDTO>} 未读统计（总未读、各类型未读）
 */
export const getUnreadMessageCount = () => {
  return request.get('/api/v1/messages/unread/count');
};

/**
 * 获取未读消息预览（最近3条）
 * @returns {Promise<Array<MessagePreviewDTO>>} 未读消息预览列表
 */
export const getUnreadMessagePreview = () => {
  return request.get('/api/v1/messages/unread/preview');
};