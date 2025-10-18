/**
 * user 模块数据模型定义(DTO)
 * /src/types/user.ts
 */

import { PageParam, PageResult, SortDirection } from "./common";

/**
 * 用户角色枚举（对应后端 UserRoleEnum）
 * 定义系统用户角色，与后端用户权限校验逻辑一致
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  NORMAL = "NORMAL",
  BANNED = "BANNED",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

/**
 * 登录类型枚举（对应后端 LoginTypeEnum）
 * 定义支持的登录方式，与后端登录接口校验规则一致
 */
export enum LoginType {
  PASSWORD = "PASSWORD",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  THIRD_PARTY = "THIRD_PARTY",
}

/**
 * 性别枚举（对应后端 GenderEnum）
 * 适配用户资料更新场景，限定性别可选值
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  SECRET = "SECRET",
  UNKNOWN = "UNKNOWN",
}

/**
 * 第三方平台类型枚举（对应后端 ThirdPartyTypeEnum）
 * 定义支持绑定/登录的第三方平台，与后端第三方账号接口逻辑对齐
 */
export enum ThirdPartyType {
  WECHAT = "WECHAT",
  QQ = "QQ",
  GITHUB = "GITHUB",
}

/**
 * 用户排序字段枚举（对应后端 ProductSortFieldEnum，后端文档中用户查询复用该枚举）
 * 定义用户列表支持的排序维度，与后端筛选逻辑一致
 */
export enum UserSortField {
  INIT_TIME = "initTime",
  CREATE_TIME = "createTime"
}

// ------------------------------ 登录相关 DTO ------------------------------
/**
 * 登录请求参数（对应后端 LoginDTO）
 * 封装不同登录方式的核心参数，与后端 login 接口参数校验规则完全匹配
 */
export interface LoginParams {
  /** 登录类型：必选，指定登录方式（账号密码/手机号/邮箱），与后端 @NotBlank 校验一致 */
  loginType: LoginType;
  /** 登录标识：必选，对应登录类型的唯一标识（用户名/手机号/邮箱），与后端 @NotBlank 校验一致 */
  loginId: string;
  /** 登录凭证：必选，对应登录类型的验证信息（密码/验证码），与后端 @NotBlank 校验一致 */
  credential: string;
  /** 短信验证码：可选，仅手机号登录（loginType=PHONE）时必填，与后端可选校验逻辑一致 */
  verifyCode?: string;
}

/**
 * 登录成功响应-用户简易信息（对应后端 LoginResultDTO 内部类 UserSimpleDTO）
 * 封装登录后需返回的核心用户标识信息，用于前端身份存储与展示
 */
export interface LoginUserSimple {
  /** 用户唯一标识：关联后端 user 表主键，用于后续接口身份校验 */
  userId: number;
  /** 用户名：展示用，与后端 UserSimpleDTO.username 字段一致 */
  username: string;
  /** 头像URL：展示用，关联后端 user 表 avatarUrl 字段 */
  avatarUrl: string;
  /** 信用分：用于判断发布商品、发帖等业务权限，与后端 UserSimpleDTO.creditScore 一致 */
  creditScore: number;
}

/**
 * 登录结果响应（对应后端 LoginResultDTO）
 * 封装登录成功后的完整返回数据，包含用户信息与令牌信息
 */
export interface LoginResult {
  /** 用户简易信息：脱敏后的核心身份数据 */
  userInfo: LoginUserSimple;
  /** JWT登录令牌：用于后续接口身份认证，前端需存储在 localStorage/cookie 中 */
  token: string;
  /** 令牌过期时间：ISO格式字符串（如 "2024-05-21T14:30:00"），前端可据此提前刷新令牌 */
  tokenExpireTime: string;
}

// ------------------------------ 注册与密码管理 DTO ------------------------------
/**
 * 注册请求参数（对应后端 RegisterDTO）
 * 封装用户注册的必填/可选参数，与后端 register 接口校验规则完全匹配
 */
export interface RegisterParams {
  /** 用户名：必选，1-20位，登录及展示用，与后端 @NotBlank、@Size(min=1, max=20) 校验一致 */
  username: string;
  /** 手机号：可选，格式需符合11位手机号规则，与后端 @Pattern 校验一致（正则：^1[3-9]\\d{9}$） */
  phoneNumber?: string;
  /** 邮箱：可选，格式需符合标准邮箱规则，与后端 @Pattern 校验一致（正则：^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$） */
  email?: string;
  /** 登录密码：必选，需含字母和数字、6-20位，加密后存储，与后端 @Pattern 校验一致 */
  password: string;
  /** 注册校验验证码：必选，6位数字，与后端 @NotBlank、@Pattern(^\\d{6}$) 校验一致 */
  verifyCode: string;
}

/**
 * 密码修改请求参数（对应后端 PasswordUpdateDTO）
 * 封装密码修改的身份校验与新密码参数，与后端 updatePassword 接口校验规则一致
 */
export interface PasswordUpdateParams {
  /** 原密码：必选，用于身份校验，与后端 @NotBlank 校验一致 */
  oldPassword: string;
  /** 新密码：必选，需含字母和数字、6-20位，与后端 @Pattern 校验一致 */
  newPassword: string;
  /** 确认新密码：必选，需与新密码一致（后端 Service 层校验），与后端 @NotBlank 校验一致 */
  confirmPassword: string;
}

// ------------------------------ 资料与第三方账号 DTO ------------------------------
/**
 * 用户资料更新请求参数（对应后端 UserProfileUpdateDTO）
 * 封装用户可修改的资料字段，支持选择性更新，与后端 updateUserProfile 接口匹配
 */
export interface UserProfileUpdateParams {
  /** 昵称：可选，1-10位，展示用，与后端 @Size(min=1, max=10) 校验一致 */
  username?: string;
  /** 头像URL：可选，需符合HTTP/HTTPS协议格式，与后端 @Pattern(^https?://.+$) 校验一致 */
  avatarUrl?: string;
  /** 个人简介：可选，无长度校验（后端未限制，前端可自行加200字限制匹配文档描述） */
  bio?: string;
  /** 兴趣标签列表：可选，后端存储为逗号分隔字符串，前端传递数组（后端接收后转换） */
  interestTags?: string[];
  /** 性别：可选，限定为 Gender 枚举值，与后端 GenderEnum 匹配 */
  gender?: Gender;
}

/**
 * 用户详情响应（对应后端 UserDetailDTO）
 * 封装用户完整信息，用于个人中心、资料展示等场景，与后端 getUserDetail 接口响应匹配
 */
export interface UserDetail {
  /** 用户唯一标识：必选，关联 user 表主键，与后端 @NotNull 校验一致 */
  userId: number;
  /** 用户名：展示用，与后端 UserDetailDTO.username 字段一致 */
  username: string;
  /** 手机号：展示用，脱敏处理（如后端未脱敏，前端可自行处理），与后端 UserDetailDTO.phoneNumber 字段一致 */
  phoneNumber?: string;
  /** 邮箱：展示用，脱敏处理（如后端未脱敏，前端可自行处理），与后端 UserDetailDTO.email 字段一致 */
  email?: string;
  /** 用户角色：展示用，与后端 UserDetailDTO.role 字段一致 */
  role: UserRole;
  /** 用户状态：展示用，与后端 UserDetailDTO.status 字段一致 */
  status: UserStatus;
  /** 头像URL：展示用，与后端 UserDetailDTO.avatarUrl 字段一致 */
  avatarUrl: string;
  /** 个人简介：列表页展示用，简化版个人简介，与后端 UserDetailDTO.bio 字段一致 */
  bio: string;
  /** 信用分：初始100分，影响发布权限，与后端 UserDetailDTO.creditScore 一致 */
  creditScore: number;
  /** 发帖数：统计用户发布帖子总量，与后端 UserDetailDTO.postCount 一致 */
  postCount: number;
  /** 兴趣标签列表：后端存储为逗号分隔字符串，前端接收为数组（后端转换后返回） */
  interestTags: string[];
  /** 注册时间：ISO格式字符串，关联 user 表 createTime 字段，展示用 */
  createTime: string;
  /** 最后活跃时间：ISO格式字符串，展示用，与后端 UserDetailDTO.lastActivityTime 字段一致 */
  activityTime: string;
  /** 性别：展示用，与后端 UserDetailDTO.gender 字段一致 */
  gender: Gender;
}

/**
 * 第三方账号绑定请求参数（对应后端 ThirdPartyBindDTO）
 * 封装第三方账号绑定的核心参数，与后端 bindThirdParty 接口校验规则一致
 */
export interface ThirdPartyBindParams {
  /** 第三方平台类型：必选，指定绑定的平台（微信/QQ/支付宝），与后端 @NotBlank 校验一致 */
  thirdType: ThirdPartyType;
  /** 第三方唯一标识：必选，平台返回的 OpenID，与后端 @NotBlank 校验一致 */
  openid: string;
  /** 第三方临时凭证：必选，用于校验账号有效性（如微信 access_token），与后端 @NotBlank 校验一致 */
  accessToken: string;
}

/**
 * 第三方绑定列表-单条绑定信息（对应后端 ThirdPartyBindingListDTO 内部类 BindingItemDTO）
 * 封装单条第三方绑定记录的脱敏信息，用于绑定列表展示
 */
export interface ThirdPartyBindingItem {
  /** 绑定记录ID：关联 user_third_party 表主键，用于解绑等操作 */
  bindingId: number;
  /** 第三方平台类型：与 ThirdPartyType 枚举一致，展示用 */
  thirdType: ThirdPartyType;
  /** 脱敏后的OpenID：如 "微信用户 ****1234"，保护用户隐私，与后端 openidDesensitized 一致 */
  openidDesensitized: string;
  /** 绑定时间：ISO格式字符串，展示用，与后端 bindTime 字段一致 */
  bindTime: string;
}

/**
 * 第三方绑定列表响应（对应后端 ThirdPartyBindingListDTO）
 * 封装用户已绑定的第三方账号列表，用于个人中心第三方账号管理场景
 */
export interface ThirdPartyBindingList {
  /** 用户ID：当前登录用户唯一标识，与后端 userId 字段一致 */
  userId: number;
  /** 有效绑定列表：用户已绑定的第三方账号集合，无绑定时为空数组 */
  bindingItems: ThirdPartyBindingItem[];
}

/**
 * 第三方登录请求参数（对应后端 ThirdPartyLoginDTO）
 * 封装第三方登录的授权参数，与后端 thirdPartyLogin 接口匹配
 */
export interface ThirdPartyLoginParams {
  /** 第三方平台类型：必选，指定登录平台，与后端 @NotBlank 校验一致 */
  thirdType: ThirdPartyType;
  /** 第三方授权码：必选，平台返回的授权码（用于获取 OpenID 和 access_token），与后端 @NotBlank 校验一致 */
  authCode: string;
}

// ------------------------------ 用户查询 DTO ------------------------------
/**
 * 用户列表查询参数（对应后端 UserQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充筛选与排序参数，与后端 queryUserList 接口匹配
 */
export interface UserQueryParams extends PageParam {
  /** 状态筛选：可选，匹配后端 selectByStatus 状态筛选，筛选指定状态的用户 */
  status?: UserStatus;
  /** 角色筛选：可选，匹配后端 selectByRole 角色筛选，筛选指定角色的用户 */
  role?: UserRole;
  /** 兴趣标签筛选：可选，匹配后端 selectByInterestTags 接口，筛选含指定标签的用户 */
  interestTags?: string[];
  /** 筛选字段：可选，指定筛选维度（如 "creditScore" 信用分、"postCount" 发帖数） */
  filterField?: string;
  /** 筛选值：可选，配合 filterField 实现条件筛选（如 filterField=creditScore 时，filterValue=80 表示筛选信用分≥80的用户） */
  filterValue?: string;
  /** 排序字段：默认按创建时间排序（与后端默认值 ProductSortFieldEnum.CREATE_TIME 一致） */
  sortField?: UserSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致） */
  sortDir?: SortDirection;
}

/**
 * 用户列表分页结果（对应后端 PageResult<UserListItemDTO>，后端文档未显式定义UserListItemDTO，按查询场景推导）
 * 复用通用 PageResult 泛型，指定列表项为 UserListItem，适配用户列表接口响应
 */
export interface UserListItem {
  /** 用户ID：用户唯一标识，用于跳转用户详情页 */
  userId: number;
  /** 用户名：展示用，脱敏处理（如后端未脱敏，前端可自行处理） */
  username: string;
  /** 头像URL：列表页展示用，简化版头像地址 */
  avatarUrl: string;
  /** 手机号：展示用，脱敏处理（如后端未脱敏，前端可自行处理），与后端 UserDetailDTO.phoneNumber 字段一致 */
  phoneNumber?: string;
  /** 邮箱：展示用，脱敏处理（如后端未脱敏，前端可自行处理），与后端 UserDetailDTO.email 字段一致 */
  email?: string;
  /** 信用分：列表页展示用户可信度，与 UserDetailDTO.creditScore 一致 */
  creditScore: number;
  /** 发帖数：列表页展示用户活跃度，与 UserDetailDTO.postCount 一致 */
  postCount: number;
  /** 注册时间：列表页格式化展示（如 "3个月前"），与 UserDetailDTO.createTime 一致 */
  createTime: string;
  /** 用户状态：列表页展示用户状态，与 UserDetailDTO.status 一致 */
  status: UserStatus;
  /** 用户角色：列表页展示用户角色，与 UserDetailDTO.role 一致 */
  role: UserRole;
}

/**
 * 用户列表分页结果（对应后端 PageResult<UserListItemDTO>）
 * 复用通用 PageResult 泛型，明确分页数据结构，前端用户列表组件可直接接收渲染
 */
export type UserListPageResult = PageResult<UserListItem>;

// ------------------------------ 用户管理 DTO ------------------------------
export interface UserStatusUpdateParams { 
userId: number; 
status: UserStatus; 
}