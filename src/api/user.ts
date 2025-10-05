/**
 * 用户相关 API 接口封装
 * /src/api/user.ts
 */

import request from './request';
import { ResultVO } from '@/types/common';
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  PasswordUpdateParams,
  UserProfileUpdateParams,
  UserDetail,
  ThirdPartyBindParams,
  ThirdPartyBindingList,
  ThirdPartyLoginParams,
  UserQueryParams,
  UserListPageResult
} from '@/types/user';

/**
 * 用户注册（对应后端 POST /api/v1/users/register）
 * @param params 注册参数（与后端 RegisterDTO 对齐）
 * @returns 登录结果（含令牌与用户信息）
 */
export const register = (params: RegisterParams) => {
  return request.post<LoginResult>('/api/v1/users/register', params);
};

/**
 * 账号密码登录（对应后端 POST /api/v1/users/login/password）
 * @param params 登录参数（与后端 LoginDTO 对齐）
 * @returns 登录结果（含令牌与用户信息）
 */
export const loginByPassword = (params: LoginParams) => {
  return request.post<LoginResult>('/api/v1/users/login/password', params);
};

/**
 * 第三方登录（对应后端 POST /api/v1/users/login/third-party）
 * @param params 第三方登录参数（与后端 ThirdPartyLoginDTO 对齐）
 * @returns 登录结果（含令牌与用户信息）
 */
export const loginByThirdParty = (params: ThirdPartyLoginParams) => {
  return request.post<LoginResult>('/api/v1/users/login/third-party', params);
};

/**
 * 获取用户详情（对应后端 GET /api/v1/users/{userId}，需登录）
 * @param userId 用户ID（路径参数）
 * @returns 用户完整信息（与后端 UserDetailDTO 对齐）
 */
export const getUserDetail = (userId: number) => {
  return request.get<UserDetail>(`/api/v1/users/${userId}`);
};

/**
 * 更新用户资料（对应后端 PUT /api/v1/users/profile，需登录）
 * @param params 资料更新参数（与后端 UserProfileUpdateDTO 对齐）
 * @returns 更新后的用户详情
 */
export const updateUserProfile = (params: UserProfileUpdateParams) => {
  return request.put<UserDetail>('/api/v1/users/profile', params);
};

/**
 * 绑定第三方账号（对应后端 POST /api/v1/users/third-party/bind，需登录）
 * @param params 第三方绑定参数（与后端 ThirdPartyBindDTO 对齐）
 * @returns 绑定结果（true=成功）
 */
export const bindThirdParty = (params: ThirdPartyBindParams) => {
  return request.post<boolean>('/api/v1/users/third-party/bind', params);
};

/**
 * 查看第三方绑定列表（对应后端 GET /api/v1/users/third-party/list，需登录）
 * @returns 绑定列表（与后端 ThirdPartyBindingListDTO 对齐）
 */
export const getThirdPartyBindList = () => {
  return request.get<ThirdPartyBindingList>('/api/v1/users/third-party/list');
};

/**
 * 管理员查询用户列表（对应后端 GET /api/v1/users/list，需管理员权限）
 * @param params 用户查询参数（与后端 UserQueryDTO 对齐，含分页）
 * @returns 分页用户列表
 */
export const queryUserList = (params: UserQueryParams) => {
  return request.get<UserListPageResult>('/api/v1/users/list', { params });
};

/**
 * 修改密码（对应后端 PUT /api/v1/users/password，需登录）
 * @param params 密码修改参数（与后端 PasswordUpdateDTO 对齐）
 * @returns 修改结果（true=成功）
 */
export const updatePassword = (params: PasswordUpdateParams) => {
  return request.put<boolean>('/api/v1/users/password', params);
};