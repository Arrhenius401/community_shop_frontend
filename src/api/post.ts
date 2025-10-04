/**
 * 帖子相关 API 接口封装
 * /src/api/post.ts
 */

import request from './request';
import type {
  PostPublishParams,
  PostDetail,
  PostQueryParams,
  PostListPageResult,
  PostUpdateParams,
  PostEssenceTopParams,
  PostStatusUpdateParams,
  PostFollowPublishParams,
  PostFollowDetail,
  PostFollowQueryParams,
  PostFollowListPageResult,
  PostFollowUpdateParams,
  PostFollowStatusUpdateParams,
  PostLikeParams
} from '@/types/post';

/**
 * 发布帖子（对应后端 POST /api/v1/posts/publish，需登录）
 * @param params 帖子发布参数（与后端 PostPublishDTO 对齐）
 * @returns 帖子详情（与后端 PostDetailDTO 对齐）
 */
export const publishPost = (params: PostPublishParams) => {
  return request.post<PostDetail>('/api/v1/posts/publish', params);
};

/**
 * 获取帖子详情（对应后端 GET /api/v1/posts/{postId}，无需登录）
 * @param postId 帖子ID（路径参数）
 * @returns 帖子完整信息
 */
export const getPostDetail = (postId: number) => {
  return request.get<PostDetail>(`/api/v1/posts/${postId}`);
};

/**
 * 编辑帖子（对应后端 PUT /api/v1/posts/{postId}，需登录且为作者）
 * @param postId 帖子ID（路径参数）
 * @param params 帖子更新参数（与后端 PostUpdateDTO 对齐）
 * @returns 更新后的帖子详情
 */
export const updatePost = (postId: number, params: PostUpdateParams) => {
  return request.put<PostDetail>(`/api/v1/posts/${postId}`, params);
};

/**
 * 帖子点赞/取消点赞（对应后端 PATCH /api/v1/posts/{postId}/like，需登录）
 * @param postId 帖子ID（路径参数）
 * @param params 点赞参数（与后端 PostLikeDTO 对齐）
 * @returns 更新后的点赞数
 */
export const likePost = (postId: number, params: PostLikeParams) => {
  return request.patch<number>(`/api/v1/posts/${postId}/like`, params);
};

/**
 * 帖子置顶/加精（对应后端 PATCH /api/v1/posts/{postId}/essence-top，需管理员权限）
 * @param postId 帖子ID（路径参数）
 * @param params 置顶/加精参数（与后端 PostEssenceTopDTO 对齐）
 * @returns 操作结果（true=成功）
 */
export const setPostEssenceOrTop = (postId: number, params: PostEssenceTopParams) => {
  return request.patch<boolean>(`/api/v1/posts/${postId}/essence-top`, params);
};

/**
 * 分页查询帖子列表（对应后端 GET /api/v1/posts/list，无需登录）
 * @param params 帖子查询参数（与后端 PostQueryDTO 对齐，含分页）
 * @returns 分页帖子列表
 */
export const queryPostList = (params: PostQueryParams) => {
  return request.get<PostListPageResult>('/api/v1/posts/list', { params });
};

/**
 * 发布跟帖（对应后端 POST /api/v1/posts/{postId}/follows，需登录）
 * @param postId 关联帖子ID（路径参数）
 * @param params 跟帖发布参数（与后端 PostFollowPublishDTO 对齐）
 * @returns 跟帖详情（与后端 PostFollowDetailDTO 对齐）
 */
export const publishPostFollow = (postId: number, params: PostFollowPublishParams) => {
  return request.post<PostFollowDetail>(`/api/v1/posts/${postId}/follows`, params);
};

/**
 * 编辑跟帖（对应后端 PUT /api/v1/posts/{postId}/follows/{followId}，需登录且为作者）
 * @param postId 关联帖子ID（路径参数）
 * @param followId 跟帖ID（路径参数）
 * @param params 跟帖更新参数（与后端 PostFollowUpdateDTO 对齐）
 * @returns 更新后的跟帖详情
 */
export const updatePostFollow = (postId: number, followId: number, params: PostFollowUpdateParams) => {
  return request.put<PostFollowDetail>(`/api/v1/posts/${postId}/follows/${followId}`, params);
};

/**
 * 分页查询跟帖列表（对应后端 GET /api/v1/posts/{postId}/follows，无需登录）
 * @param postId 关联帖子ID（路径参数）
 * @param params 跟帖查询参数（与后端 PostFollowQueryDTO 对齐，含分页）
 * @returns 分页跟帖列表
 */
export const queryPostFollowList = (postId: number, params: PostFollowQueryParams) => {
  return request.get<PostFollowListPageResult>(`/api/v1/posts/${postId}/follows`, { params });
};

/**
 * 管理员更新跟帖状态（对应后端 PATCH /api/v1/posts/{postId}/follows/{followId}/status，需管理员权限）
 * @param postId 关联帖子ID（路径参数）
 * @param followId 跟帖ID（路径参数）
 * @param params 跟帖状态参数（与后端 PostFollowStatusUpdateDTO 对齐）
 * @returns 操作结果（true=成功）
 */
export const updatePostFollowStatus = (postId: number, followId: number, params: PostFollowStatusUpdateParams) => {
  return request.patch<boolean>(`/api/v1/posts/${postId}/follows/${followId}/status`, params);
};