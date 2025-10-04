import request from './request';
import type {
  MessageSendParams,
  MessageDetail,
  MessageQueryParams,
  MessageListPageResult,
  MessageStatusUpdateParams,
  MessageStat,
  MessagePreview,
  PrivateMessageQueryParams,
  PrivateMessageDetail,
  PrivateMessageListPageResult
} from '@/types/message';

/**
 * 发送私信（对应后端 POST /api/v1/messages/private，需登录）
 * @param params 消息发送参数（与后端 MessageSendDTO 对齐，type=PRIVATE）
 * @returns 消息ID（用于后续查询详情）
 */
export const sendPrivateMessage = (params: MessageSendParams) => {
  return request.post<number>('/api/v1/messages/private', params);
};

/**
 * 获取消息详情（对应后端 GET /api/v1/messages/{msgId}，需登录且为消息归属人）
 * @param msgId 消息ID（路径参数）
 * @returns 消息完整信息（与后端 MessageDetailDTO 对齐）
 */
export const getMessageDetail = (msgId: number) => {
  return request.get<MessageDetail>(`/api/v1/messages/${msgId}`);
};

/**
 * 标记消息已读/删除（对应后端 PATCH /api/v1/messages/{msgId}/status，需登录）
 * @param msgId 消息ID（路径参数）
 * @param params 状态更新参数（与后端 MessageStatusUpdateDTO 对齐）
 * @returns 操作结果（true=成功）
 */
export const updateMessageStatus = (msgId: number, params: MessageStatusUpdateParams) => {
  return request.patch<boolean>(`/api/v1/messages/${msgId}/status`, params);
};

/**
 * 分页查询消息列表（如系统通知、订单通知，对应后端 GET /api/v1/messages/list，需登录）
 * @param params 消息查询参数（与后端 MessageQueryDTO 对齐，含类型筛选、分页）
 * @returns 分页消息列表
 */
export const queryMessageList = (params: MessageQueryParams) => {
  return request.get<MessageListPageResult>('/api/v1/messages/list', { params });
};

/**
 * 统计未读消息数（对应后端 GET /api/v1/messages/unread/count，需登录）
 * @returns 未读消息统计（按类型分类，与后端 MessageStatDTO 对齐）
 */
export const countUnreadMessages = () => {
  return request.get<MessageStat>('/api/v1/messages/unread/count');
};

/**
 * 获取未读消息预览（对应后端 GET /api/v1/messages/unread/preview，需登录）
 * @returns 最近3条未读消息精简信息（与后端 MessagePreviewDTO 对齐）
 */
export const getUnreadMessagePreview = () => {
  return request.get<MessagePreview[]>('/api/v1/messages/unread/preview');
};

/**
 * 查询私聊消息记录（对应后端 GET /api/v1/messages/private/list，需登录）
 * @param params 私聊查询参数（与后端 PrivateMessageQueryDTO 对齐，含谈话对象ID、分页）
 * @returns 分页私聊消息列表
 */
export const queryPrivateMessageList = (params: PrivateMessageQueryParams) => {
  return request.get<PrivateMessageListPageResult>('/api/v1/messages/private/list', { params });
};