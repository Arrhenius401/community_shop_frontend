import request from './request';

/**
 * 发布商品
 * @param {Object} params - 商品参数（与后端ProductPublishDTO对齐）
 * @param {string} params.title - 商品标题（必填）
 * @param {string} params.category - 商品类别（必填，如"二手手机"）
 * @param {number} params.price - 商品价格（必填）
 * @param {string} params.condition - 成色（必填，全新/9成新等）
 * @param {number} params.stock - 库存数量（必填）
 * @param {Array<string>} [params.images] - 商品图片（最多9张）
 * @returns {Promise<ProductDetailDTO>} 发布成功后的商品详情
 */
export const publishProduct = (params) => {
  return request.post('/api/v1/products/publish', params);
};

/**
 * 搜索商品
 * @param {Object} params - 搜索参数
 * @param {string} [params.keyword] - 搜索关键词（模糊匹配标题）
 * @param {string} [params.category] - 商品类别（筛选）
 * @param {number} [params.minPrice] - 最低价格（筛选）
 * @param {number} [params.maxPrice] - 最高价格（筛选）
 * @param {string} [params.condition] - 成色（筛选）
 * @param {string} [params.sortType] - 排序类型（PRICE-价格，SALE-销量，VIEW-浏览量）
 * @param {number} [params.pageNum] - 页码（默认1）
 * @param {number} [params.pageSize] - 每页条数（默认10）
 * @returns {Promise<PageResult<ProductListItemDTO>>} 分页商品列表
 */
export const searchProduct = (params) => {
  return request.get('/api/v1/products/search', { params });
};

/**
 * 获取商品详情
 * @param {number} productId - 商品ID（路径参数）
 * @returns {Promise<ProductDetailDTO>} 商品详情（含卖家信息、库存等）
 */
export const getProductDetail = (productId) => {
  return request.get(`/api/v1/products/${productId}`);
};