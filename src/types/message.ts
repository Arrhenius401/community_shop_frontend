// 引入通用分页类型，适配消息列表查询的分页需求；引入基础用户信息类型，复用发送者/接收者共性字段
import { PageParam, PageResult, SortDirection, BaseUserInfo } from "./common";

/**
 * 消息类型枚举（对应后端 MessageTypeEnum）
 * 定义消息分类，决定前端展示样式（如图标、颜色）与权限，与后端消息发送、筛选逻辑完全匹配
 */
export type MessageType = "ORDER" | "SYSTEM" | "AFTER_SALE" | "PRIVATE";

/**
 * 消息状态枚举（对应后端 MessageStatusEnum）
 * 覆盖消息全生命周期状态，适配消息标记已读、删除等操作，与后端状态流转逻辑一致
 */
export type MessageStatus = "UNREAD" | "READ" | "DELETED";

/**
 * 消息排序字段枚举（对应后端 MessageSortFieldEnum）
 * 定义消息列表支持的排序维度，与后端查询逻辑对齐
 */
export type MessageSortField = "CREATE_TIME";

// ------------------------------ 消息核心 DTO ------------------------------
/**
 * 消息发送请求参数（对应后端 MessageSendDTO）
 * 封装消息发送核心参数，适配私信、系统通知等不同发送场景，与后端 sendPrivateMessage 接口校验规则完全匹配
 */
export interface MessageSendParams {
  /** 接收者ID：可选，私信场景必填（定位接收用户），系统通知场景可为 null（全员/指定范围接收），与后端非必选规则一致 */
  receiverId?: number;
  /** 消息标题：可选，系统通知场景必填（如 "订单状态变更通知"），私信场景可省略，与后端业务适配逻辑一致 */
  title?: string;
  /** 消息内容：必选，最长1000字，核心消息主体，与后端 @NotBlank、@Size(max=1000) 校验一致 */
  content: string;
  /** 消息类型：必选，指定消息分类（决定展示样式），与后端 @NotNull 校验一致 */
  type: MessageType;
  /** 关联业务ID：可选，关联具体业务（如订单ID、帖子ID），用于点击消息跳转对应业务页面 */
  businessId?: number;
  /** 附件URL列表：可选，JSON格式字符串，最多3个附件（如图片、文件链接），与后端存储逻辑一致 */
  attachments?: string;
}

/**
 * 消息详情-发送者信息（对应后端 MessageDetailDTO 内部类 SenderDTO）
 * 继承通用 BaseUserInfo，复用用户ID、用户名、头像URL字段，适配消息详情页发送者信息展示
 */
export interface MessageSender extends BaseUserInfo {
  // 无额外字段，系统消息场景下 userId 为后端固定值，前端无需特殊处理
}

/**
 * 消息详情-接收者信息（对应后端 MessageDetailDTO 内部类 ReceiverDTO）
 * 仅管理员可见，封装接收者核心标识，与后端脱敏逻辑一致
 */
export interface MessageReceiver {
  /** 接收者ID：接收用户唯一标识 */
  userId: number;
  /** 接收者用户名：脱敏展示（如后端未脱敏，前端可自行处理） */
  username: string;
}

/**
 * 消息详情-关联业务信息（对应后端 MessageDetailDTO 内部类 BusinessInfoDTO）
 * 封装消息关联的业务数据，用于点击消息跳转对应业务页面
 */
export interface MessageBusinessInfo {
  /** 关联业务ID：如订单ID、帖子ID，与 MessageSendParams.businessId 一致 */
  businessId: number;
  /** 业务标题：如订单编号、帖子标题，展示用，帮助用户快速识别业务场景 */
  title: string;
  /** 跳转链接：如帖子详情页、订单详情页URL，前端点击消息时直接跳转 */
  url: string;
}

/**
 * 消息详情响应（对应后端 MessageDetailDTO）
 * 封装消息完整信息，用于消息详情页全量数据展示，与后端 getMessageDetail 接口响应匹配
 */
export interface MessageDetail {
  /** 消息ID：必选，消息唯一标识，用于消息详情页定位、状态更新等操作 */
  messageId: number;
  /** 消息内容：必选，完整消息主体（已过滤敏感词） */
  content: string;
  /** 发送者信息：必选，脱敏后的发送者数据，继承通用 BaseUserInfo */
  sender: MessageSender;
  /** 接收者信息：可选，仅管理员可见（普通用户无权限查看），与后端权限控制逻辑一致 */
  receiver?: MessageReceiver;
  /** 附件URL列表：必选，数组格式（后端返回时已将JSON字符串转换为数组），适配前端附件渲染 */
  attachments: string[];
  /** 关联业务信息：可选，无关联业务时为 null，用于业务跳转 */
  businessInfo?: MessageBusinessInfo;
  /** 消息状态：必选，当前消息状态（未读/已读/已删除），用于详情页状态展示 */
  status: MessageStatus;
  /** 发送时间：必选，ISO格式字符串，展示消息发送时间，前端可格式化处理 */
  createTime: string;
}

/**
 * 消息列表项-发送者信息（对应后端 MessageListItemDTO 内部类 SenderDTO）
 * 复用 MessageSender 类型，精简列表页发送者展示信息，减少数据传输量
 */
export type MessageListItemSender = MessageSender;

/**
 * 消息列表项响应（对应后端 MessageListItemDTO）
 * 封装消息列表页精简信息，配合分页结果使用，适配消息中心列表高效展示
 */
export interface MessageListItem {
  /** 消息ID：必选，用于点击跳转详情页 */
  messageId: number;
  /** 内容摘要：必选，消息内容前30字（后端处理），适配列表页有限展示空间 */
  contentSummary: string;
  /** 发送者信息：必选，脱敏后的发送者数据，与 MessageSender 结构一致 */
  sender: MessageListItemSender;
  /** 消息类型：必选，用于列表页展示不同图标（如订单通知用购物车图标） */
  type: MessageType;
  /** 消息状态：必选，用于列表页显示未读红点（UNREAD 状态时展示） */
  status: MessageStatus;
  /** 发送时间：必选，ISO格式字符串，列表页格式化展示（如 "1小时前"） */
  createTime: string;
  /** 是否有附件：必选，布尔值标识（true 显示附件图标，false 隐藏），提升列表页辨识度 */
  hasAttachment: boolean;
}

/**
 * 未读消息预览DTO（对应后端 MessagePreviewDTO）
 * 封装用户最近未读消息的精简信息，用于消息中心顶部预览或弹窗提醒
 */
export interface MessagePreview {
  /** 消息ID：必选，用于点击预览消息跳转详情页 */
  messageId: number;
  /** 发送者名称：必选，脱敏展示（如 "系统通知"、"用户张三"），快速识别消息来源 */
  senderName: string;
  /** 消息内容摘要：必选，精简内容（后端处理），适配预览区域有限空间 */
  contentSummary: string;
  /** 消息类型：必选，用于预览区域展示对应类型图标 */
  type: MessageType;
  /** 发送时间：必选，ISO格式字符串，展示未读消息发送时间 */
  createTime: string;
  /** 关联业务ID：可选，用于预览消息点击跳转对应业务页面 */
  businessId?: number;
}

// ------------------------------ 消息查询 DTO ------------------------------
/**
 * 消息列表查询参数（对应后端 MessageQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充筛选与排序参数，与后端 queryMessageList 接口匹配
 */
export interface MessageQueryParams extends PageParam {
  /** 消息类型：可选，筛选指定类型消息（如只看订单通知），与后端业务筛选逻辑一致 */
  type?: MessageType;
  /** 消息状态：可选，筛选指定状态消息（如只看未读消息），与后端状态筛选逻辑一致 */
  status?: MessageStatus;
  /** 搜索关键词：可选，模糊匹配消息内容，适配消息搜索功能 */
  keyword?: string;
  /** 排序字段：默认按发送时间排序（与后端默认值 MessageSortFieldEnum.CREATE_TIME 一致） */
  sortField?: MessageSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致，最新消息优先） */
  sortDir?: SortDirection;
}

/**
 * 私聊消息查询参数（对应后端 PrivateMessageQueryDTO）
 * 继承通用 PageParam 获得分页能力，封装私聊场景专属筛选参数，与后端 queryPrivateMessages 接口匹配
 */
export interface PrivateMessageQueryParams extends PageParam {
  /** 当前用户ID：必选，当前登录用户唯一标识，用于数据权限校验（仅查询自己的私聊记录），与后端 @NotNull 校验一致 */
  userId: number;
  /** 谈话对象ID：必选，私聊对象唯一标识，定位与指定用户的聊天记录，与后端 @NotNull 校验一致 */
  partnerId: number;
  /** 消息类型：可选，筛选私聊中的指定类型消息（如只看文本消息，默认无筛选） */
  type?: MessageType;
}

// ------------------------------ 消息状态与统计 DTO ------------------------------
/**
 * 消息状态更新请求参数（对应后端 MessageStatusUpdateDTO）
 * 封装消息状态变更参数，适配标记已读、删除等操作，与后端 updateMessageStatus 接口匹配
 */
export interface MessageStatusUpdateParams {
  /** 消息ID：必选，定位待更新状态的消息，与后端 @NotNull 校验一致 */
  messageId: number;
  /** 目标状态：必选，仅支持已读（READ）、已删除（DELETED），与后端状态流转限制一致 */
  targetStatus: "READ" | "DELETED";
}

/**
 * 未读消息统计DTO（对应后端 MessageStatDTO）
 * 封装用户未读消息的分类统计数据，用于消息中心顶部未读计数展示
 */
export interface MessageStat {
  /** 总未读消息数：必选，所有类型未读消息总和，默认0（无未读时） */
  totalUnread: number;
  /** 订单通知类未读消息数：必选，MessageType.ORDER 类型的未读消息数 */
  orderUnread: number;
  /** 系统公告类未读消息数：必选，MessageType.SYSTEM 类型的未读消息数 */
  systemUnread: number;
  /** 售后提醒类未读消息数：必选，MessageType.AFTER_SALE 类型的未读消息数 */
  afterSaleUnread: number;
}

// ------------------------------ 私聊专用 DTO ------------------------------
/**
 * 私聊消息详情-发送者信息（对应后端 PrivateMessageDetailDTO 内部类 SenderDTO）
 * 复用 MessageSender 类型，适配私聊界面发送者信息展示
 */
export type PrivateMessageSender = MessageSender;

/**
 * 私聊消息详情响应（对应后端 PrivateMessageDetailDTO）
 * 封装私聊场景下的消息完整信息，适配类似微信的私聊界面展示需求
 */
export interface PrivateMessageDetail {
  /** 消息ID：必选，私聊消息唯一标识 */
  messageId: number;
  /** 消息内容：必选，私聊消息主体（支持文本、表情等） */
  content: string;
  /** 发送者信息：必选，脱敏后的发送者数据，与 PrivateMessageSender 结构一致 */
  sender: PrivateMessageSender;
  /** 附件URL列表：必选，数组格式（后端返回时已转换），适配私聊界面附件渲染（如图片预览） */
  attachments: string[];
  /** 发送时间：必选，ISO格式字符串，私聊界面按时间排序展示消息 */
  createTime: string;
}

// ------------------------------ 消息分页结果 DTO ------------------------------
/**
 * 消息列表分页结果（对应后端 PageResult<MessageListItemDTO>）
 * 复用通用 PageResult 泛型，明确分页数据结构，前端消息中心列表组件可直接接收渲染
 */
export type MessageListPageResult = PageResult<MessageListItem>;

/**
 * 私聊消息列表分页结果（对应后端 PageResult<PrivateMessageDetailDTO>）
 * 复用通用 PageResult 泛型，适配私聊界面分页加载聊天记录的需求
 */
export type PrivateMessageListPageResult = PageResult<PrivateMessageDetail>;