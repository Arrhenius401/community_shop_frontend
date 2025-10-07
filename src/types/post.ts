/**
 * post 模块数据模型定义(DTO)
 * /src/types/post.ts
 */

import { PageParam, PageResult, SortDirection, BaseUserInfo } from "./common";

/**
 * 帖子状态枚举（对应后端 PostStatusEnum）
 * 适配帖子列表查询、状态更新等场景的状态筛选需求
 */
export type PostStatus = "NORMAL" | "OFF_SHELF" | "DELETED";

/**
 * 帖子排序字段枚举（对应后端 PostSortFieldEnum）
 * 定义帖子列表支持的排序维度，与后端筛选逻辑保持一致
 */
export type PostSortField = "CREATE_TIME" | "LIKE_COUNT" | "COMMENT_COUNT";

/**
 * 跟帖状态枚举（对应后端 PostFollowStatusEnum）
 * 适配跟帖列表查询、状态更新场景，区分正常/隐藏跟帖
 */
export type PostFollowStatus = "NORMAL" | "HIDDEN";

/**
 * 跟帖排序字段枚举（对应后端 ProductSortFieldEnum，后端文档中跟帖查询复用该枚举）
 * 目前仅支持按发布时间排序，与后端查询逻辑对齐
 */
export type PostFollowSortField = "CREATE_TIME";

// ------------------------------ 帖子核心 DTO ------------------------------
/**
 * 帖子发布请求参数（对应后端 PostPublishDTO）
 * 封装用户发布帖子的必填/可选参数，前端表单输入需匹配此结构
 */
export interface PostPublishParams {
  /** 帖子标题：非空，最大50字（与后端 @NotBlank、@Size(max=50) 校验规则一致） */
  title: string;
  /** 帖子内容：非空，最大2000字，支持富文本（与后端 @NotBlank、@Size(max=2000) 校验规则一致） */
  content: string;
  /** 图片URL列表：可选，JSON格式字符串，最多9张（后端存储为String，前端无需解析，直接传递） */
  imageUrls?: string;
}

/**
 * 帖子发布者详情（对应后端 PostDetailDTO 内部类 PublisherDTO）
 * 继承通用 BaseUserInfo，补充信用分字段，适配帖子详情页发布者信息展示
 */
export interface PostPublisher extends BaseUserInfo {
  /** 发布者信用分：用于展示内容可信度，与后端 PublisherDTO.creditScore 字段一致 */
  creditScore: number;
}

/**
 * 帖子详情响应数据（对应后端 PostDetailDTO）
 * 封装帖子完整信息及关联数据，用于帖子详情页全量信息展示
 */
export interface PostDetail {
  /** 帖子唯一标识：与后端 postId 字段一致，用于跳转、更新等操作 */
  postId: number;
  /** 帖子标题：与发布时一致，已过滤敏感词 */
  title: string;
  /** 帖子内容：已过滤敏感词，支持富文本渲染 */
  content: string;
  /** 图片URL列表：数组格式，适配前端轮播组件（后端返回已转换为数组，无需前端处理） */
  imageUrls: string[];
  /** 帖子点赞数：实时展示点赞统计 */
  likeCount: number;
  /** 帖子跟帖数：实时展示跟帖统计 */
  commentCount: number;
  /** 是否为热门帖：运营标记，用于详情页特殊标识 */
  isHot: boolean;
  /** 是否为精华帖：运营标记，用于详情页特殊标识 */
  isEssence: boolean;
  /** 是否为置顶帖：运营标记，用于详情页特殊标识 */
  isTop: boolean;
  /** 当前登录用户是否已点赞：用于前端点赞状态切换（已赞/未赞） */
  isLiked: boolean;
  /** 帖子发布时间：ISO格式字符串（如 "2024-05-20T14:30:00"），前端可格式化展示 */
  createTime: string;
  /** 发布者信息：脱敏后的用户详情，继承通用 BaseUserInfo 补充信用分 */
  publisher: PostPublisher;
}

/**
 * 帖子列表项发布者信息（对应后端 PostListItemDTO 内部类 PublisherSimpleDTO）
 * 精简版发布者信息，仅包含列表页必需的ID和用户名，减少数据传输量
 */
export interface PostListItemPublisher {
  /** 发布者ID：用于跳转发布者主页 */
  userId: number;
  /** 发布者用户名：列表页展示，无需脱敏（后端已处理） */
  username: string;
}

/**
 * 帖子列表项响应数据（对应后端 PostListItemDTO）
 * 封装列表页精简信息，仅保留展示必需字段，提升前端加载速度
 */
export interface PostListItem {
  /** 帖子ID：用于跳转详情页 */
  postId: number;
  /** 帖子标题：列表页核心展示字段 */
  title: string;
  /** 首图URL：无图时前端需展示默认图片，与后端 coverImage 逻辑一致 */
  coverImage: string;
  /** 帖子摘要：列表页展示，截取内容前20字（与后端 @Size(max=20) 校验规则一致） */
  summary: string;
  /** 帖子点赞数：列表页简要统计 */
  likeCount: number;
  /** 帖子跟帖数：列表页简要统计 */
  commentCount: number;
  /** 发布时间：列表页格式化展示（如 "2小时前"） */
  createTime: string;
  /** 发布者极简信息：仅包含ID和用户名，适配列表页紧凑展示 */
  publisher: PostListItemPublisher;
}

/**
 * 帖子列表查询参数（对应后端 PostQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充筛选、排序参数，与后端查询接口匹配
 */
export interface PostQueryParams extends PageParam {
  /** 搜索关键词：模糊匹配标题/内容，可选 */
  keyword?: string;
  /** 发布者ID：查询指定用户的帖子，可选 */
  userId?: number;
  /** 帖子状态：筛选指定状态的帖子（如 "NORMAL" 正常帖），可选 */
  status?: PostStatus;
  /** 排序字段：默认按发布时间排序（与后端默认值 PostSortFieldEnum.CREATE_TIME 一致） */
  sortField?: PostSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致） */
  sortDir?: SortDirection;
}

/**
 * 帖子更新请求参数（对应后端 PostUpdateDTO）
 * 仅包含用户有权限修改的字段，与后端 updatePost 接口参数匹配
 */
export interface PostUpdateParams {
  /** 帖子ID：定位待更新帖子，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 操作人ID：用于权限校验（需与发布者ID一致），非空（与后端 @NotNull 校验规则一致） */
  operatorId: number;
  /** 新帖子标题：非空，最大100字符（与后端 @NotBlank、@Size(max=100) 校验规则一致） */
  title: string;
  /** 新帖子内容：非空，最大5000字符（与后端 @NotBlank、@Size(max=5000) 校验规则一致） */
  content: string;
}

// ------------------------------ 帖子运营管理 DTO ------------------------------
/**
 * 帖子置顶/加精请求参数（对应后端 PostEssenceTopDTO）
 * 封装管理员操作参数，与后端 setPostEssenceOrTop 接口匹配
 */
export interface PostEssenceTopParams {
  /** 帖子ID：定位待操作帖子，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 是否设为精华帖：非空（true=是，false=否），与后端 @NotNull 校验规则一致 */
  isEssence: boolean;
  /** 是否设为置顶帖：非空（true=是，false=否），与后端 @NotNull 校验规则一致 */
  isTop: boolean;
}

/**
 * 帖子状态更新请求参数（对应后端 PostStatusUpdateDTO）
 * 封装帖子状态变更参数，支持下架、删除等流转，与后端 updatePostStatus 接口匹配
 */
export interface PostStatusUpdateParams {
  /** 帖子ID：定位待更新状态的帖子，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 目标状态：需为 PostStatus 合法值（如 "OFF_SALE" 下架），非空（与后端 @NotBlank 校验规则一致） */
  targetStatus: PostStatus;
  /** 操作人ID：用于权限校验（管理员或发布者），非空（与后端 @NotNull 校验规则一致） */
  operatorId: number;
  /** 状态变更原因：可选，最大200字（如 "内容违规"） */
  reason?: string;
}

// ------------------------------ 跟帖相关 DTO ------------------------------
/**
 * 跟帖发布请求参数（对应后端 PostFollowPublishDTO）
 * 封装用户发布跟帖的参数，与后端 publishPostFollow 接口匹配
 */
export interface PostFollowPublishParams {
  /** 关联帖子ID：必须绑定具体帖子，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 跟帖内容：非空，1-500字（与后端 @NotBlank、@Size(min=1, max=500) 校验规则一致） */
  content: string;
  /** @用户ID列表：可选，逗号分隔字符串（如 "1001,1002"） */
  atUserIds?: string;
}

/**
 * 跟帖人信息（对应后端 PostFollowDetailDTO 内部类 FollowerDTO）
 * 继承通用 BaseUserInfo，适配跟帖详情页发布者信息展示
 */
export interface PostFollower extends BaseUserInfo {
  // 无额外字段，直接复用 BaseUserInfo 的 userId、username、avatarUrl
}

/**
 * 跟帖详情响应数据（对应后端 PostFollowDetailDTO）
 * 封装跟帖完整信息，用于跟帖详情页展示
 */
export interface PostFollowDetail {
  /** 跟帖ID：跟帖唯一标识 */
  postFollowId: number;
  /** 关联帖子ID：关联主帖，用于跳转主帖 */
  postId: number;
  /** 跟帖内容：跟帖正文 */
  content: string;
  /** 跟帖点赞数：实时统计点赞量 */
  likeCount: number;
  /** 当前用户是否已点赞：用于跟帖点赞状态切换 */
  isLiked: boolean;
  /** 跟帖状态：正常/隐藏（与 PostFollowStatus 一致） */
  status: PostFollowStatus;
  /** 发布时间：ISO格式字符串 */
  createTime: string;
  /** 最后编辑时间：未编辑则为 null */
  updateTime?: string;
  /** 跟帖人信息：脱敏后的用户详情 */
  follower: PostFollower;
}

/**
 * 跟帖列表查询参数（对应后端 PostFollowQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充跟帖筛选、排序参数，与后端 queryPostFollowsByPostId 接口匹配
 */
export interface PostFollowQueryParams extends PageParam {
  /** 帖子ID：查询指定帖子的跟帖，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 跟帖状态：默认查询正常跟帖（与后端默认值 PostFollowStatusEnum.NORMAL 一致） */
  status?: PostFollowStatus;
  /** 排序字段：仅支持按发布时间排序（与后端默认值 ProductSortFieldEnum.CREATE_TIME 一致） */
  sortField?: PostFollowSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致） */
  sortDir?: SortDirection;
}

/**
 * 跟帖更新请求参数（对应后端 PostFollowUpdateDTO）
 * 封装用户编辑跟帖的参数，与后端 updatePostFollow 接口匹配
 */
export interface PostFollowUpdateParams {
  /** 跟帖ID：定位待更新跟帖，非空（与后端 @NotNull 校验规则一致） */
  postFollowId: number;
  /** 新跟帖内容：非空，1-500字（与后端 @NotBlank、@Size(min=1, max=500) 校验规则一致） */
  newContent: string;
  /** @用户ID列表：可选，更新后的@用户列表 */
  atUserIds?: string;
}

/**
 * 跟帖状态更新请求参数（对应后端 PostFollowStatusUpdateDTO）
 * 封装管理员变更跟帖状态的参数，与后端 updatePostFollowStatus 接口匹配
 */
export interface PostFollowStatusUpdateParams {
  /** 跟帖ID：定位待更新状态的跟帖，非空（与后端 @NotNull 校验规则一致） */
  postFollowId: number;
  /** 目标状态：正常/隐藏（与 PostFollowStatus 一致），非空（与后端 @NotNull 校验规则一致） */
  targetStatus: PostFollowStatus;
}

// ------------------------------ 帖子点赞 DTO ------------------------------
/**
 * 帖子点赞/取消点赞请求参数（对应后端 PostLikeDTO）
 * 封装用户点赞操作参数，与后端 likePost 接口匹配
 */
export interface PostLikeParams {
  /** 帖子ID：定位待点赞/取消点赞的帖子，非空（与后端 @NotNull 校验规则一致） */
  postId: number;
  /** 操作用户ID：当前登录用户ID，非空（与后端 @NotNull 校验规则一致） */
  userId: number;
  /** 操作类型：true=点赞，false=取消点赞，非空（与后端 @NotNull 校验规则一致） */
  isLike: boolean;
}

// ------------------------------ 分页结果类型 ------------------------------
/**
 * 帖子列表分页结果（对应后端 PageResult<PostListItemDTO>）
 * 复用通用 PageResult 泛型，指定列表项为 PostListItem，适配帖子列表接口响应
 */
export type PostListPageResult = PageResult<PostListItem>;

/**
 * 跟帖列表分页结果（对应后端 PageResult<PostFollowDetailDTO>）
 * 复用通用 PageResult 泛型，指定列表项为 PostFollowDetail，适配跟帖列表接口响应
 */
export type PostFollowListPageResult = PageResult<PostFollowDetail>;