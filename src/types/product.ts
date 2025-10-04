// 引入通用分页类型，适配商品列表查询的分页需求；复用排序方向通用类型
import { PageParam, PageResult, SortDirection } from "./common";

/**
 * 商品成色枚举（对应后端 ProductConditionEnum）
 * 定义商品新旧程度选项，适配商品发布、筛选场景，与后端校验规则完全匹配
 */
export type ProductCondition = "NEW" | "NINE_NEW" | "EIGHT_NEW" | "SEVEN_NEW" | "OTHER";

/**
 * 商品状态枚举（对应后端 ProductStatusEnum）
 * 覆盖商品上架、下架状态，适配商品发布、更新、筛选场景
 */
export type ProductStatus = "ON_SALE" | "OFF_SALE";

/**
 * 商品排序字段枚举（对应后端 ProductSortFieldEnum）
 * 定义商品列表支持的排序维度，与后端查询逻辑对齐
 */
export type ProductSortField = "viewCount" | "createTime" | "price";

// ------------------------------ 商品基础信息 DTO ------------------------------
/**
 * 商品发布请求参数（对应后端 ProductPublishDTO）
 * 封装卖家发布商品的核心必填/可选参数，与后端 publishProduct 接口校验规则完全匹配
 */
export interface ProductPublishParams {
  /** 卖家ID：必选，当前登录卖家唯一标识，用于权限校验，与后端 @NotNull 校验一致 */
  sellerId: number;
  /** 商品标题：必选，最长50字符，核心展示字段，与后端 @NotBlank、@Size(max=50) 校验一致 */
  title: string;
  /** 商品类别：必选，如 "二手手机" "家居用品"，用于商品分类筛选，与后端 @NotBlank 校验一致 */
  category: string;
  /** 商品单价：必选，大于0且保留2位小数，与后端 @NotNull、@Positive 校验一致 */
  price: number;
  /** 库存数量：必选，大于0，与后端 @NotNull、@Positive 校验一致 */
  stock: number;
  /** 商品描述：必选，最长1000字符，支持富文本，与后端 @NotBlank、@Size(max=1000) 校验一致 */
  description: string;
  /** 图片URL列表：可选，JSON格式字符串，最多9张图片，与后端存储逻辑一致 */
  imageUrls?: string[];
  /** 商品成色：必选，指定商品新旧程度，与后端 @NotNull 校验一致 */
  condition: ProductCondition;
}

/**
 * 商品更新请求参数（对应后端 ProductUpdateDTO）
 * 封装商品信息的选择性更新参数，支持标题、价格等字段修改，与后端 updateProduct 接口匹配
 */
export interface ProductUpdateParams {
  /** 商品ID：必选，定位待更新商品，与后端 @NotNull 校验一致 */
  productId: number;
  /** 商品标题：可选，最长100字符，与后端 @Length(min=1, max=100) 校验一致 */
  title?: string;
  /** 商品描述：可选，最长2000字符，支持富文本扩展，与后端 @Length(max=2000) 校验一致 */
  description?: string;
  /** 商品单价：可选，大于0，与后端 @NotNull、@DecimalMin(value="0.0", inclusive=false) 校验一致（更新时必传则需加@NotNull） */
  price?: number;
  /** 库存数量：可选，大于等于0，与后端 @NotNull、@Min(value=0) 校验一致（更新时必传则需加@NotNull） */
  stock?: number;
  /** 商品类别：可选，最长50字符，与后端 @Length(max=50) 校验一致 */
  category?: string;
  /** 商品状态：可选，指定商品上架/下架，与后端 @NotNull 校验一致（更新状态时必传） */
  status?: ProductStatus;
  /** 商品成色：可选，与后端 @NotNull 校验一致（更新成色时必传） */
  condition?: ProductCondition;
  /** 商品主图URL：可选，最长255字符，与后端 @Length(max=255) 校验一致 */
  mainImageUrl?: string;
  /** 商品详情图URL数组：可选，更新详情图列表，与后端存储逻辑一致 */
  detailImageUrls?: string[];
}

// ------------------------------ 商品查询与展示 DTO ------------------------------
/**
 * 商品搜索查询参数（对应后端 ProductQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充多维度筛选与排序参数，适配买家商品查找场景
 */
export interface ProductQueryParams extends PageParam {
  /** 搜索关键词：可选，模糊匹配商品标题/描述，适配搜索功能 */
  keyword?: string;
  /** 商品类别：可选，精确筛选指定类别的商品 */
  category?: string;
  /** 最低价格：可选，价格区间筛选下限 */
  minPrice?: number;
  /** 最高价格：可选，价格区间筛选上限 */
  maxPrice?: number;
  /** 商品成色：可选，精确筛选指定成色的商品 */
  condition?: ProductCondition;
  /** 商品状态：可选，精确筛选在售/下架商品（买家默认筛选在售商品） */
  status?: ProductStatus;
  /** 排序字段：默认按发布时间排序（与后端默认值 ProductSortFieldEnum.CREATE_TIME 一致） */
  sortField?: ProductSortField;
  /** 排序方向：默认降序（与后端默认值 SortDirectionEnum.DESC 一致） */
  sortDir?: SortDirection;
}

/**
 * 卖家商品查询参数（对应后端 SellerProductQueryDTO）
 * 继承通用 PageParam 获得分页能力，封装卖家视角的商品筛选参数，与后端 querySellerProductList 接口匹配
 */
export interface SellerProductQueryParams extends PageParam {
  /** 卖家ID：必选，当前登录卖家唯一标识，用于数据隔离（仅查询自己的商品），与后端 @NotNull 校验一致 */
  sellerId: number;
  /** 商品状态：可选，默认筛选在售商品（与后端默认值 ProductStatusEnum.ON_SALE 一致） */
  status?: ProductStatus;
  /** 排序字段：可选，默认按发布时间排序（与后端默认值 "createTime" 一致） */
  sortField?: "createTime" | "stock" | "viewCount";
  /** 排序方向：可选，默认降序（与后端默认值 "desc" 一致） */
  sortDir?: "asc" | "desc";
}

/**
 * 商品列表项响应（对应后端 ProductListItemDTO）
 * 封装商品列表页精简信息，减少数据传输量，适配商品列表高效展示
 */
export interface ProductListItem {
  /** 商品标题：必选，列表页核心展示字段，与后端 @NotBlank 校验一致 */
  title: string;
  /** 商品类别：必选，列表页分类标识，与后端 @NotBlank 校验一致 */
  category: string;
  /** 商品单价：必选，大于0，列表页价格展示，与后端 @NotNull、@Positive 校验一致 */
  price: number;
  /** 库存数量：必选，大于等于0，列表页库存提示，与后端 @NotNull、@Positive（发布时）校验一致 */
  stock: number;
  /** 商品描述：必选，精简展示（后端处理），与后端 @NotBlank 校验一致 */
  description: string;
  /** 商品成色：必选，列表页成色标签展示，与后端 @NotNull 校验一致 */
  condition: ProductCondition;
  /** 商品状态：必选，列表页状态标签（在售/下架），与后端 @NotNull 校验一致 */
  status: ProductStatus;
  /** 商品主图URL：必选，列表页缩略图展示，无图时用默认图片 */
  mainImageUrl: string;
}

/**
 * 商品详情响应（对应后端 ProductDetailDTO）
 * 封装商品详情页完整信息，包含基础信息、图片、浏览量等，适配商品详情展示场景
 */
export interface ProductDetail {
  /** 商品ID：必选，商品唯一标识，用于详情页定位、后续操作（如下单） */
  productId: number;
  /** 卖家ID：必选，关联卖家唯一标识，用于跳转卖家主页 */
  sellerId: number;
  /** 商品标题：必选，详情页核心标题展示 */
  title: string;
  /** 商品类别：必选，详情页分类标识 */
  category: string;
  /** 商品单价：必选，详情页价格展示 */
  price: number;
  /** 剩余库存：必选，详情页库存提示（实时更新） */
  stock: number;
  /** 商品描述：必选，支持富文本渲染，详情页完整展示 */
  description: string;
  /** 图片URL列表：必选，数组格式，适配前端轮播组件展示 */
  imageUrls: string[];
  /** 浏览量：必选，详情页热度展示 */
  viewCount: number;
  /** 发布时间：必选，ISO格式字符串，详情页发布时间展示（前端可格式化） */
  createTime: string;
  /** 商品状态：必选，详情页状态标识（在售/下架） */
  status: ProductStatus;
  /** 商品成色：必选，详情页成色详细说明 */
  condition: ProductCondition;
}

// ------------------------------ 商品库存与状态 DTO ------------------------------
/**
 * 商品库存调整请求参数（对应后端 ProductStockUpdateDTO）
 * 封装库存增减参数，适配订单扣减、补货等场景，与后端 updateProductStock 接口匹配
 */
export interface ProductStockUpdateParams {
  /** 商品ID：必选，定位需调整库存的商品，与后端 @NotNull 校验一致 */
  productId: number;
  /** 库存变更值：必选，正数增加库存，负数减少库存（扣减时后端校验库存充足），与后端 @NotNull 校验一致 */
  stockChange: number;
  /** 调整原因：可选，如 "补货" "订单扣减" "库存盘点修正"，用于日志记录 */
  reason?: string;
}

/**
 * 商品状态更新请求参数（对应后端 ProductStatusUpdateDTO）
 * 封装商品上架/下架状态流转参数，与后端 updateProductStatus 接口匹配
 */
export interface ProductStatusUpdateParams {
  /** 商品ID：必选，定位待更新状态的商品，与后端 @NotNull 校验一致 */
  productId: number;
  /** 目标状态：必选，指定商品上架（ON_SALE）/下架（OFF_SALE），与后端 @NotNull 校验一致 */
  status: ProductStatus;
}

// ------------------------------ 商品分页结果 DTO ------------------------------
/**
 * 商品列表分页结果（对应后端 PageResult<ProductListItemDTO>）
 * 复用通用 PageResult 泛型，明确分页数据结构，前端商品列表组件可直接接收渲染
 */
export type ProductListPageResult = PageResult<ProductListItem>;

/**
 * 卖家商品列表分页结果（对应后端 PageResult<ProductListItemDTO>）
 * 复用通用 PageResult 泛型，适配卖家中心商品列表分页展示需求
 */
export type SellerProductListPageResult = PageResult<ProductListItem>;