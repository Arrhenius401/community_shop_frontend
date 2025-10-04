/**
 * evaluation 模块数据模型定义(DTO)
 * /src/types/evaluation.ts
 */

import { PageParam, PageResult, SortDirection, BaseUserInfo } from "./common";

/**
 * 评价类型枚举（对应后端 EvaluationTypeEnum）
 * 区分商品评价、卖家服务评价，决定前端展示维度
 */
export type EvaluationType = "PRODUCT" | "SELLER";

/**
 * 评分维度枚举（对应后端 EvaluationScoreDimensionEnum）
 * 定义可评分的维度，适配多维度评分场景（如商品质量、物流速度）
 */
export type ScoreDimension = "QUALITY" | "SPEED" | "SERVICE" | "PRICE";

/**
 * 评价排序字段枚举（对应后端 EvaluationSortFieldEnum）
 * 与后端评价列表查询排序逻辑对齐
 */
export type EvaluationSortField = "CREATE_TIME" | "SCORE" | "USEFUL_COUNT";

// ------------------------------ 评价核心 DTO ------------------------------
/**
 * 评价提交请求参数（对应后端 EvaluationSubmitDTO）
 * 适配后端 POST /api/v1/evaluations/submit 接口，包含多维度评分与内容
 */
export interface EvaluationSubmitParams {
  /** 订单ID：必选，关联已完成订单（仅订单完成后可评价），与后端 @NotNull 校验一致 */
  orderId: number;
  /** 评价类型：必选，指定评价对象（商品/卖家），与后端 @NotBlank 校验一致 */
  type: EvaluationType;
  /** 关联ID：必选，评价对象唯一标识（商品ID/卖家ID），与后端 @NotNull 校验一致 */
  relatedId: number;
  /** 评分列表：必选，多维度评分（如商品质量5分、物流速度4分），与后端 @NotEmpty 校验一致 */
  scores: Array<{
    dimension: ScoreDimension; // 评分维度
    score: number; // 评分值（1-5分），与后端 @Min(1) @Max(5) 校验一致
  }>;
  /** 评价内容：可选，最长500字，与后端 @Size(max=500) 校验一致 */
  content?: string;
  /** 评价图片URL列表：可选，JSON格式字符串，最多3张图片，与后端存储逻辑一致 */
  imageUrls?: string[];
}

/**
 * 评价详情-评价人信息（对应后端 EvaluationDetailDTO 内部类 EvaluatorDTO）
 * 继承通用 BaseUserInfo，复用用户ID、用户名、头像字段，适配评价详情页展示
 */
export interface EvaluationEvaluator extends BaseUserInfo {
  /** 买家等级：可选，如 "VIP1"，用于评价人身份标识，与后端 EvaluatorDTO 一致 */
  buyerLevel?: string;
}

/**
 * 评价详情响应（对应后端 EvaluationDetailDTO）
 * 适配后端 GET /api/v1/evaluations/{evalId} 接口，包含评价全量信息
 */
export interface EvaluationDetail {
  /** 评价ID：必选，评价唯一标识，用于详情页定位 */
  evalId: number;
  /** 订单ID：必选，关联订单，用于跳转订单详情 */
  orderId: number;
  /** 评价类型：必选，区分商品/卖家评价，与 EvaluationType 一致 */
  type: EvaluationType;
  /** 关联ID：必选，商品ID/卖家ID，与评价对象绑定 */
  relatedId: number;
  /** 评分列表：必选，多维度评分结果（后端已计算平均分） */
  scores: Array<{
    dimension: ScoreDimension;
    score: number;
    dimensionName: string; // 维度中文名称，如 "商品质量"，直接用于前端展示
  }>;
  /** 平均评分：必选，所有维度评分的平均值（保留1位小数），与后端计算结果一致 */
  avgScore: number;
  /** 评价内容：可选，无内容时为 null */
  content?: string;
  /** 评价图片URL列表：必选，数组格式（后端返回时已转换JSON字符串），适配前端图片预览 */
  imageUrls: string[];
  /** 评价人信息：必选，脱敏后的用户数据，继承 BaseUserInfo */
  evaluator: EvaluationEvaluator;
  /** 有用数：必选，其他用户点击"有用"的次数 */
  usefulCount: number;
  /** 当前用户是否已点赞"有用"：必选，用于前端点赞状态切换 */
  isUseful: boolean;
  /** 评价时间：必选，ISO格式字符串，前端可格式化展示（如 "2024-05-20 14:30"） */
  createTime: string;
}

/**
 * 评价列表项响应（对应后端 EvaluationListItemDTO）
 * 适配评价列表页精简展示，减少数据传输量，与后端分页查询响应对齐
 */
export interface EvaluationListItem {
  /** 评价ID：必选，用于点击跳转详情页 */
  evalId: number;
  /** 评价类型：必选，列表页类型标签展示 */
  type: EvaluationType;
  /** 平均评分：必选，列表页星级展示（如 4.5 对应4.5颗星） */
  avgScore: number;
  /** 评价内容摘要：必选，评价内容前50字（后端处理），适配列表页有限空间 */
  contentSummary: string;
  /** 评价人名称：必选，脱敏展示（如 "用户***"），与后端 EvaluatorDTO 脱敏逻辑一致 */
  evaluatorName: string;
  /** 评价人头像：必选，列表页缩略图展示 */
  evaluatorAvatar: string;
  /** 评价时间：必选，ISO格式字符串，列表页格式化展示（如 "3天前"） */
  createTime: string;
  /** 是否有图片：必选，布尔值标识（true 显示图片图标），提升列表页辨识度 */
  hasImage: boolean;
}

// ------------------------------ 评价查询 DTO ------------------------------
/**
 * 商品评价查询参数（对应后端 ProductEvaluationQueryDTO）
 * 继承通用 PageParam 获得分页能力，适配后端 GET /api/v1/evaluations/product/{id} 接口
 */
export interface ProductEvaluationQueryParams extends PageParam {
  /** 商品ID：必选，路径参数，定位查询商品的评价，与后端 @PathVariable 校验一致 */
  productId: number;
  /** 最低评分：可选，筛选平均分≥该值的评价（如 4 筛选4分及以上评价） */
  minScore?: number;
  /** 是否有图：可选，true=仅查带图评价，false=查所有评价，默认false */
  hasImage?: boolean;
  /** 排序字段：默认按评价时间排序（与后端默认值 EvaluationSortFieldEnum.CREATE_TIME 一致） */
  sortField?: EvaluationSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致） */
  sortDir?: SortDirection;
}

/**
 * 卖家评分统计查询参数（对应后端 SellerScoreQueryDTO）
 * 适配后端 GET /api/v1/evaluations/seller/{id}/score 接口，用于筛选统计维度
 */
export interface SellerScoreQueryParams {
  /** 卖家ID：必选，路径参数，定位查询卖家的评分，与后端 @PathVariable 校验一致 */
  sellerId: number;
  /** 时间范围：可选，筛选指定时间内的评分（如 "7D"=近7天，"30D"=近30天），默认全量 */
  timeRange?: "7D" | "30D" | "90D" | "ALL";
}

/**
 * 卖家评分统计响应（对应后端 SellerScoreStatDTO）
 * 适配后端评分统计接口，包含多维度平均分与评价数量
 */
export interface SellerScoreStat {
  /** 卖家ID：必选，与查询参数 sellerId 一致 */
  sellerId: number;
  /** 综合平均分：必选，所有维度评分的平均值（保留1位小数） */
  overallAvgScore: number;
  /** 维度评分明细：必选，各维度的平均分与评价数量 */
  dimensionStats: Array<{
    dimension: ScoreDimension;
    dimensionName: string; // 维度中文名称，如 "服务态度"
    avgScore: number; // 该维度平均分
    evalCount: number; // 该维度评价数量
  }>;
  /** 总评价数量：必选，统计范围内的总评价数 */
  totalEvalCount: number;
  /** 5分评价占比：必选，百分比（如 65 表示65%） */
  fiveStarRatio: number;
  /** 统计时间范围：必选，如 "2024-04-20 至 2024-05-20"，与查询参数 timeRange 对应 */
  statTimeRange: string;
}

// ------------------------------ 评价分页结果 DTO ------------------------------
/**
 * 商品评价列表分页结果（对应后端 PageResult<EvaluationListItemDTO>）
 * 复用通用 PageResult 泛型，适配商品评价列表分页展示
 */
export type ProductEvaluationListPageResult = PageResult<EvaluationListItem>;

/**
 * 评价详情分页结果（对应后端 PageResult<EvaluationDetailDTO>，如卖家查询自己的评价）
 * 复用通用 PageResult 泛型，适配全量评价详情分页场景
 */
export type EvaluationDetailListPageResult = PageResult<EvaluationDetail>;