/**
 * 通用分页查询参数和结果封装
 * 适用于所有需要分页的查询场景，如商品列表、帖子列表、消息列表等
 * /src/types/common.ts
 */


/**
 * 通用返回结果封装（对应后端 ResultVO 类）
 * 适用于所有返回结果场景，如用户登录、用户查询、商品查询等
 */
export interface ResultVO<T = any> {
  code: string;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 通用分页查询参数（对应后端 PageParam 类）
 * 适配所有需要分页的查询场景，如商品列表、帖子列表、消息列表等
 */
export interface PageParam {
  /** 当前页码，默认值1（后端默认值一致） */
  pageNum?: number;
  /** 每页记录数，默认值10（后端默认值一致） */
  pageSize?: number;
  /** 分页查询偏移量，由pageNum和pageSize计算得出，前端可无需手动设置 */
  offset?: number;
}

/**
 * 通用分页查询结果封装（对应后端 PageResult 泛型类）
 * 支持泛型适配不同业务模块的列表数据，如商品列表、帖子列表等
 * @template T - 列表项数据类型（如 ProductListItem、PostListItem 等）
 */
export interface PageResult<T> {
  /** 总记录数（从数据库查询获取） */
  total: number;
  /** 总页数（由total和pageSize计算得出） */
  totalPages: number;
  /** 当前页数据列表（泛型T对应具体业务的列表项类型） */
  list: T[];
  /** 当前页码（与请求参数pageNum一致） */
  pageNum: number;
  /** 每页记录数（与请求参数pageSize一致） */
  pageSize: number;
}

/**
 * 通用排序方向枚举（对应后端 SortDirectionEnum）
 * 适配所有需要排序的查询场景，如帖子按点赞数排序、消息按时间排序等
 */
export enum SortDirection {
  /** 升序 */
  ASC = "ASC",
  /** 降序 */
  DESC = "DESC"
}

/**
 * 通用用户脱敏信息类型（适配后端各模块中发布者、发送者的共性信息）
 * 如帖子发布者（PublisherDTO）、消息发送者（SenderDTO）等可复用此类型
 */
export interface BaseUserInfo {
  /** 用户唯一标识 */
  userId: number;
  /** 用户名（脱敏展示，如后端返回的原始用户名或处理后的昵称） */
  username: string;
  /** 用户头像URL（用于前端展示头像） */
  avatarUrl?: string;
}

/**
 * 通用附件信息类型（适配后端各模块中附件的共性结构）
 * 如帖子图片、消息附件等场景，支持URL列表和基础描述
 */
export interface BaseAttachment {
  /** 附件URL（图片、文件等资源地址） */
  url: string;
  /** 附件名称（可选，如图片名称、文件名） */
  name?: string;
  /** 附件类型（可选，如"image"、"file"，用于前端区分渲染方式） */
  type?: string;
}