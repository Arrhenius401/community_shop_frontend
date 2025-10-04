import request from './request';
import type {
  EvaluationSubmitParams,
  EvaluationDetail,
  ProductEvaluationQueryParams,
  ProductEvaluationListPageResult,
  SellerScoreQueryParams,
  SellerScoreStat,
  EvaluationDetailListPageResult
} from '@/types/evaluation';
import type { PageParam, SortDirection } from '@/types/common';

/**
 * 提交评价（对应后端 POST /api/v1/evaluations/submit，需登录）
 * @param params 评价提交参数（与后端 EvaluationSubmitDTO 对齐）
 * @returns 提交成功的评价ID
 */
export const submitEvaluation = (params: EvaluationSubmitParams) => {
  return request.post<number>('/api/v1/evaluations/submit', params);
};

/**
 * 获取评价详情（对应后端 GET /api/v1/evaluations/{evalId}，需登录）
 * @param evalId 评价ID（路径参数，与后端 @PathVariable Long evalId 对齐）
 * @returns 评价全量信息（与后端 EvaluationDetailDTO 对齐）
 */
export const getEvaluationDetail = (evalId: number) => {
  // 前端预校验：确保评价ID为有效数字，减少无效请求
  if (!evalId || typeof evalId !== 'number' || evalId <= 0) {
    throw new Error('评价ID必须为正整数');
  }
  return request.get<EvaluationDetail>(`/api/v1/evaluations/${evalId}`);
};

/**
 * 查询商品评价列表（对应后端 GET /api/v1/evaluations/product/{id}，无需登录）
 * @param productId 商品ID（路径参数，与后端 @PathVariable Long id 对齐）
 * @param params 评价查询参数（含分页、筛选条件，与后端 ProductEvaluationQueryDTO 对齐）
 * @returns 分页商品评价列表
 */
export const getProductEvaluationList = (
  productId: number,
  params: Omit<ProductEvaluationQueryParams, 'productId'> // 剔除路径参数，避免重复传递
) => {
  if (!productId || typeof productId !== 'number' || productId <= 0) {
    throw new Error('商品ID必须为正整数');
  }
  // 合并路径参数与查询参数，确保与后端接口参数对齐
  const requestParams = { productId, ...params };
  return request.get<ProductEvaluationListPageResult>(
    `/api/v1/evaluations/product/${productId}`,
    { params: requestParams }
  );
};

/**
 * 统计卖家评分（对应后端 GET /api/v1/evaluations/seller/{id}/score，无需登录）
 * @param sellerId 卖家ID（路径参数，与后端 @PathVariable Long id 对齐）
 * @param params 评分统计参数（含时间范围，与后端 SellerScoreQueryDTO 对齐）
 * @returns 卖家评分统计数据（与后端 SellerScoreStatDTO 对齐）
 */
export const getSellerScoreStat = (
  sellerId: number,
  params?: Omit<SellerScoreQueryParams, 'sellerId'> // 剔除路径参数，可选传递时间范围
) => {
  if (!sellerId || typeof sellerId !== 'number' || sellerId <= 0) {
    throw new Error('卖家ID必须为正整数');
  }
  const requestParams = { sellerId, ...params };
  return request.get<SellerScoreStat>(
    `/api/v1/evaluations/seller/${sellerId}/score`,
    { params: requestParams }
  );
};

/**
 * 评价点赞"有用"（对应后端 PATCH /api/v1/evaluations/{evalId}/useful，需登录）
 * @param evalId 评价ID（路径参数）
 * @param isUseful 是否标记为有用（true=有用，false=取消有用），与后端请求体参数对齐
 * @returns 更新后的有用数
 */
export const toggleEvaluationUseful = (evalId: number, isUseful: boolean) => {
  if (!evalId || typeof evalId !== 'number' || evalId <= 0) {
    throw new Error('评价ID必须为正整数');
  }
  return request.patch<number>(`/api/v1/evaluations/${evalId}/useful`, { isUseful });
};

/**
 * 卖家查询自己的评价列表（对应后端 GET /api/v1/evaluations/seller/list，需登录）
 * @param params 分页参数（与后端 PageParam 对齐，支持按时间/评分排序）
 * @returns 分页评价详情列表（与后端 PageResult<EvaluationDetailDTO> 对齐）
 */
export const getSellerOwnEvaluationList = (params: PageParam & { sortField?: string; sortDir?: SortDirection }) => {
  return request.get<EvaluationDetailListPageResult>(
    '/api/v1/evaluations/seller/list',
    { params }
  );
};