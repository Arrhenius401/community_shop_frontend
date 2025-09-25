import request from './request';

/**
 * 发布跟帖
 * @param {number} postId - 帖子ID（路径参数，所属帖子）
 * @param {Object} params - 跟帖参数（与后端PostFollowPublishDTO对齐）
 * @param {string} params.content - 跟帖内容（必填）
 * @param {number} [params.atUserId] - @用户ID（可选）
 * @returns {Promise<PostFollowDetailDTO>} 发布成功后的跟帖详情
 */
export const publishPostFollow = (postId, params) => {
  return request.post(`/api/v1/posts/${postId}/follows`, params);
};

/**
 * 编辑跟帖
 * @param {number} postId - 帖子ID（路径参数）
 * @param {number} followId - 跟帖ID（路径参数）
 * @param {Object} params - 更新参数（与后端PostFollowUpdateDTO对齐）
 * @param {string} params.content - 跟帖内容（必填）
 * @returns {Promise<PostFollowDetailDTO>} 编辑后的跟帖详情
 */
export const updatePostFollow = (postId, followId, params) => {
  return request.put(`/api/v1/posts/${postId}/follows/${followId}`, params);
};

/**
 * 更新跟帖状态（管理员）
 * @param {number} postId - 帖子ID（路径参数）
 * @param {number} followId - 跟帖ID（路径参数）
 * @param {Object} params - 状态参数（与后端PostFollowStatusUpdateDTO对齐）
 * @param {string} params.status - 跟帖状态（NORMAL-正常，DELETED-删除）
 * @returns {Promise<boolean>} 操作结果（true成功）
 */
export const updatePostFollowStatus = (postId, followId, params) => {
  return request.patch(`/api/v1/posts/${postId}/follows/${followId}/status`, params);
};

/**
 * 分页查询跟帖列表
 * @param {number} postId - 帖子ID（路径参数，所属帖子）
 * @param {Object} params - 查询参数（与后端PostFollowQueryDTO对齐）
 * @param {number} [params.pageNum] - 页码（默认1）
 * @param {number} [params.pageSize] - 每页条数（默认10）
 * @returns {Promise<PageResult<PostFollowDetailDTO>>} 分页跟帖列表
 */
export const getPostFollowList = (postId, params) => {
  return request.get(`/api/v1/posts/${postId}/follows`, { params });
};