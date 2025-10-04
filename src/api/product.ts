/**
 * 商品相关 API 接口封装
 * /src/api/product.ts
 */

import request from './request';
import type {
  ProductPublishParams,
  ProductDetail,
  ProductQueryParams,
  ProductListPageResult,
  ProductUpdateParams,
  SellerProductQueryParams,
  SellerProductListPageResult,
  ProductStockUpdateParams,
  ProductStatusUpdateParams
} from '@/types/product';

/**
 * 发布商品（对应后端 POST /api/v1/products/publish，需登录）
 * @param params 商品发布参数（与后端 ProductPublishDTO 对齐，补充 sellerId）
 * @returns 发布后的商品详情
 */
export const publishProduct = (params: ProductPublishParams) => {
  return request.post<ProductDetail>('/api/v1/products/publish', params);
};

/**
 * 搜索商品（对应后端 GET /api/v1/products/search，无需登录）
 * @param params 商品搜索参数（与后端 ProductQueryDTO 对齐，修复 sortType→sortField）
 * @returns 分页商品列表
 */
export const searchProduct = (params: ProductQueryParams) => {
  return request.get<ProductListPageResult>('/api/v1/products/search', { params });
};

/**
 * 获取商品详情（对应后端 GET /api/v1/products/{productId}，无需登录）
 * @param productId 商品ID（路径参数）
 * @returns 商品完整信息（与后端 ProductDetailDTO 对齐）
 */
export const getProductDetail = (productId: number) => {
  return request.get<ProductDetail>(`/api/v1/products/${productId}`);
};

/**
 * 卖家更新商品信息（对应后端 PUT /api/v1/products/{productId}，需登录且为卖家）
 * @param productId 商品ID（路径参数）
 * @param params 商品更新参数（与后端 ProductUpdateDTO 对齐）
 * @returns 更新后的商品详情
 */
export const updateProduct = (productId: number, params: ProductUpdateParams) => {
  return request.put<ProductDetail>(`/api/v1/products/${productId}`, params);
};

/**
 * 卖家查询自己的商品列表（对应后端 GET /api/v1/products/seller/list，需登录）
 * @param params 卖家商品查询参数（与后端 SellerProductQueryDTO 对齐，含分页）
 * @returns 分页商品列表
 */
export const querySellerProductList = (params: SellerProductQueryParams) => {
  return request.get<SellerProductListPageResult>('/api/v1/products/seller/list', { params });
};

/**
 * 调整商品库存（对应后端 PATCH /api/v1/products/{productId}/stock，需登录且为卖家）
 * @param productId 商品ID（路径参数）
 * @param params 库存调整参数（与后端 ProductStockUpdateDTO 对齐）
 * @returns 调整后的库存数
 */
export const updateProductStock = (productId: number, params: ProductStockUpdateParams) => {
  return request.patch<number>(`/api/v1/products/${productId}/stock`, params);
};

/**
 * 商品上下架（对应后端 PATCH /api/v1/products/{productId}/status，需登录且为卖家）
 * @param productId 商品ID（路径参数）
 * @param params 商品状态参数（与后端 ProductStatusUpdateDTO 对齐）
 * @returns 操作结果（true=成功）
 */
export const updateProductStatus = (productId: number, params: ProductStatusUpdateParams) => {
  return request.patch<boolean>(`/api/v1/products/${productId}/status`, params);
};