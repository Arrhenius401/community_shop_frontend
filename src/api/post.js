import request from './request';

/**
 * 发布帖子
 * @param {Object} params - 发布参数（与后端PostPublishDTO对齐）
 * @param {string} params.title - 帖子标题（必填）
 * @param {string} params.content - 帖子内容（富文本，必填）
 * @param {string} params.barName - 所属主题吧（必填）
 * @param {Array<string>} [params.images] - 图片地址列表（最多9张）
 * @param {Array<string>} [params.tags] - 话题标签（可选，系统自动建议）
 * @returns {Promise<PostDetailDTO>} 发布成功后的帖子详情
 */
export const publishPost = (params) => {
  return request.post('/api/v1/posts/publish', params);
};

/**
 * 获取帖子详情
 * @param {number} postId - 帖子ID（路径参数）
 * @returns {Promise<PostDetailDTO>} 帖子详情（含内容、点赞数、评论数等）
 */
export const getPostDetail = (postId) => {
  return request.get(`/api/v1/posts/${postId}`);
};

/**
 * 编辑帖子
 * @param {number} postId - 帖子ID（路径参数）
 * @param {Object} params - 更新参数（与后端PostUpdateDTO对齐）
 * @param {string} [params.title] - 帖子标题
 * @param {string} [params.content] - 帖子内容
 * @param {Array<string>} [params.tags] - 话题标签
 * @returns {Promise<PostDetailDTO>} 编辑后的帖子详情
 */
export const updatePost = (postId, params) => {
  return request.put(`/api/v1/posts/${postId}`, params);
};

/**
 * 帖子点赞/取消点赞
 * @param {number} postId - 帖子ID（路径参数）
 * @param {Object} params - 点赞参数（与后端PostLikeDTO对齐）
 * @param {boolean} params.isLike - 是否点赞（true点赞，false取消）
 * @returns {Promise<number>} 更新后的点赞数
 */
export const likePost = (postId, params) => {
  return request.patch(`/api/v1/posts/${postId}/like`, params);
};

/**
 * 帖子置顶/加精
 * @param {number} postId - 帖子ID（路径参数）
 * @param {Object} params - 状态参数（与后端PostEssenceTopDTO对齐）
 * @param {boolean} [params.isTop] - 是否置顶
 * @param {boolean} [params.isEssence] - 是否加精
 * @returns {Promise<boolean>} 操作结果（true成功）
 */
export const setPostEssenceTop = (postId, params) => {
  return request.patch(`/api/v1/posts/${postId}/essence-top`, params);
};

/**
 * 分页查询帖子列表
 * @param {Object} params - 查询参数（与后端PostQueryDTO对齐）
 * @param {string} [params.barName] - 主题吧名称（筛选）
 * @param {string} [params.sortType] - 排序类型（TIME-时间线，HOT-热度，ESSENCE-精华）
 * @param {string} [params.tag] - 话题标签（筛选）
 * @param {number} [params.pageNum] - 页码（默认1）
 * @param {number} [params.pageSize] - 每页条数（默认10）
 * @returns {Promise<PageResult<PostListItemDTO>>} 分页帖子列表
 */
export const getPostList = (params) => {
  return request.get('/api/v1/posts/list', { params });
};