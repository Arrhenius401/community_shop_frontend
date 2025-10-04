// 引入通用分页类型，适配订单列表查询的分页需求
import { PageParam, PageResult, SortDirection } from "./common";

/**
 * 支付方式枚举（对应后端 PayTypeEnum）
 * 定义支持的订单支付方式，与后端订单创建、支付接口校验规则一致
 */
export type PayType = "ALIPAY" | "WECHAT" | "CARD";

/**
 * 订单状态枚举（对应后端 OrderStatusEnum）
 * 覆盖订单全生命周期状态，与后端订单状态流转、筛选逻辑完全匹配
 */
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "RECEIVED" | "CANCELLED" | "REFUNDED";

/**
 * 操作人类型枚举（对应后端订单查询中的 operatorType 字段）
 * 区分订单操作角色，适配买家/卖家/系统视角的订单筛选需求
 */
export type OperatorType = "BUYER" | "SELLER" | "SYSTEM";

// ------------------------------ 订单创建与支付 DTO ------------------------------
/**
 * 订单创建请求参数（对应后端 OrderCreateDTO）
 * 封装买家下单核心参数，与后端 createOrder 接口校验规则完全匹配
 */
export interface OrderCreateParams {
  /** 商品ID：必选，关联 product 表主键，定位下单商品，与后端 @NotNull 校验一致 */
  productId: number;
  /** 收货地址：必选，最长500字符，用于物流配送，与后端 @NotBlank、@Length(max=500) 校验一致 */
  address: string;
  /** 购买数量：必选，大于0，默认1件，与后端 @NotNull、@Positive 校验一致 */
  quantity: number;
  /** 订单总金额：必选，大于0，需等于商品单价×数量（防篡改），与后端 @NotNull、@Positive 校验一致 */
  totalAmount: number;
  /** 买家留言：可选，最长200字符，用于备注特殊需求，与后端 @Length(max=200) 校验一致 */
  buyerRemark?: string;
  /** 支付方式：必选，指定订单支付渠道，与后端 @NotBlank 校验一致 */
  payType: PayType;
}

/**
 * 订单支付请求参数（对应后端 OrderPayDTO）
 * 封装订单支付核心参数，包含金额校验逻辑，与后端 payOrder 接口匹配
 */
export interface OrderPayParams {
  /** 订单ID：必选，关联 order 表主键，定位待支付订单，与后端 @NotNull 校验一致 */
  orderId: number;
  /** 支付方式：必选，需与订单创建时选择的支付方式一致，与后端 @NotBlank 校验一致 */
  payType: PayType;
  /** 支付金额：必选，大于0，需与订单总金额完全一致（防篡改），与后端 @NotNull、@Positive 校验一致 */
  payAmount: number;
  /** 支付密码：可选，部分支付方式（如银行卡支付）需验证，后端非必校验 */
  payPassword?: string;
  /** 第三方支付额外参数：可选，JSON格式字符串（如支付宝 authCode、微信 openId），适配第三方支付接口 */
  extraParams?: string;
}

/**
 * 支付回调参数（对应后端 PayCallbackDTO）
 * 封装第三方支付平台异步回调数据，用于后端更新订单状态，前端无需主动传递（仅需了解结构用于异常排查）
 */
export interface PayCallbackParams {
  /** 系统内部订单号：必选，匹配后端 order 表 orderNo 字段，用于关联订单 */
  orderNo: string;
  /** 支付金额：必选，保留2位小数，与订单支付金额一致 */
  payAmount: number;
  /** 支付方式：必选，第三方支付渠道标识（如 "WECHAT_PAY"、"ALIPAY"） */
  payType: string;
  /** 第三方支付流水号：必选，第三方平台唯一交易标识，用于对账 */
  payNo: string;
  /** 支付状态：必选，第三方返回的支付结果（"SUCCESS" 成功/"FAIL" 失败） */
  payStatus: string;
  /** 支付完成时间：必选，格式 "yyyy-MM-dd HH:mm:ss"，用于记录订单支付时间 */
  payTime: string;
  /** 签名信息：必选，用于验证回调请求合法性（后端校验，前端无需处理） */
  sign: string;
  /** 支付平台附加参数：可选，JSON格式字符串，第三方平台额外返回信息 */
  attach?: string;
}

// ------------------------------ 订单状态与物流 DTO ------------------------------
/**
 * 订单状态更新请求参数（对应后端 OrderStatusUpdateDTO）
 * 封装订单状态变更参数，包含操作人权限校验，与后端 updateOrderStatus 接口匹配
 */
export interface OrderStatusUpdateParams {
  /** 订单ID：必选，定位待更新状态的订单，与后端 @NotNull 校验一致 */
  orderId: number;
  /** 目标状态：必选，订单需流转到的状态（如 "PAID" 已支付/"SHIPPED" 已发货），与后端 @NotBlank 校验一致 */
  targetStatus: OrderStatus;
  /** 操作人ID：必选，用于权限校验（区分买家/卖家/系统），与后端 @NotNull 校验一致 */
  operatorId: number;
  /** 附加信息：可选，如支付流水号（状态更新为 PAID 时）、物流单号（状态更新为 SHIPPED 时） */
  extraInfo?: string;
}

/**
 * 订单发货请求参数（对应后端 OrderShipDTO）
 * 封装卖家发货核心参数，与后端 shipOrder 接口校验规则完全匹配
 */
export interface OrderShipParams {
  /** 订单ID：必选，定位待发货订单，与后端 @NotNull 校验一致 */
  orderId: number;
  /** 快递公司名称：必选，如 "顺丰速运"、"中通快递"，与后端 @NotBlank 校验一致 */
  expressCompany: string;
  /** 物流单号：必选，快递公司唯一物流标识，与后端 @NotBlank 校验一致 */
  expressNo: string;
  /** 发货备注：可选，用于备注物流特殊信息（如 "易碎品"） */
  shipRemark?: string;
}

// ------------------------------ 订单查询与展示 DTO ------------------------------
/**
 * 订单查询参数（对应后端 OrderQueryDTO）
 * 继承通用 PageParam 获得分页能力，补充筛选参数，适配多角色订单查询场景
 */
export interface OrderQueryParams extends PageParam {
  /** 订单ID：可选，精准查询单个订单（优先级高于其他筛选条件） */
  orderId?: number;
  /** 订单状态：可选，筛选指定状态的订单（如 "PAID" 已支付订单），与后端 @NotBlank 校验（仅当筛选时必传）一致 */
  status?: OrderStatus;
  /** 操作人类型：必选，指定查询视角（买家/卖家/系统），与后端 @NotBlank 校验一致 */
  operatorType: OperatorType;
  /** 附加信息：可选，如物流单号（筛选指定物流单号的订单） */
  extraInfo?: string;
}

/**
 * 订单列表项响应（对应后端 OrderListItemDTO）
 * 封装订单列表页精简信息，减少数据传输量，适配买家/卖家订单列表展示
 */
export interface OrderListItem {
  /** 订单ID：必选，用于跳转订单详情页 */
  orderId: number;
  /** 订单编号：必选，系统生成的唯一订单标识（如 "ORD20240520123456"），展示用 */
  orderNo: string;
  /** 商品缩略信息：必选，如 "商品1等3件"，列表页简化展示商品信息 */
  productSummary: string;
  /** 商品首图：必选，列表页商品缩略图URL，无图时展示默认图片 */
  productImage: string;
  /** 订单总金额：必选，展示订单支付/应付金额 */
  totalAmount: number;
  /** 订单状态：必选，带状态描述（如 "待支付"），用于列表页状态标签展示 */
  status: OrderStatus;
  /** 下单时间：必选，ISO格式字符串，列表页格式化展示（如 "2小时前"） */
  createTime: string;
  /** 支付时间：可选，未支付则为 null，展示订单支付时间 */
  payTime?: string;
}

/**
 * 订单详情响应（对应后端 OrderDetailDTO）
 * 封装订单详情页完整信息，包含买卖双方、商品、支付、物流等全量数据
 */
export interface OrderDetail {
  /** 订单ID：必选，订单唯一标识 */
  orderId: number;
  /** 商品ID：必选，关联下单商品，用于跳转商品详情页 */
  productId: number;
  /** 买家ID：必选，关联 buyer 表主键，用于买家信息展示 */
  buyerId: number;
  /** 卖家ID：必选，关联 seller 表主键，用于卖家信息展示 */
  sellerId: number;
  /** 订单编号：必选，系统唯一订单标识，详情页核心展示字段 */
  orderNo: string;
  /** 购买数量：必选，订单商品购买件数 */
  quantity: number;
  /** 订单总金额：必选，订单最终支付金额 */
  totalAmount: number;
  /** 收货地址：必选，买家填写的物流地址，详情页完整展示 */
  address: string;
  /** 买家留言：可选，买家下单时填写的备注信息 */
  buyerRemark?: string;
  /** 支付时间：可选，未支付则为 null，展示订单支付完成时间 */
  payTime?: string;
  /** 发货时间：可选，未发货则为 null，展示卖家发货时间 */
  shipTime?: string;
  /** 收货时间：可选，未确认收货则为 null，展示买家确认收货时间 */
  receiveTime?: string;
  /** 订单创建时间：必选，展示订单生成时间 */
  createTime: string;
  /** 订单备注：可选，系统或管理员添加的订单备注（如 "优先发货"） */
  remark?: string;
  /** 订单状态：必选，详情页核心状态展示（如 "已发货"） */
  status: OrderStatus;
  /** 支付方式：必选，展示订单支付渠道（如 "支付宝"） */
  payType: PayType;
}

// ------------------------------ 订单分页结果 DTO ------------------------------
/**
 * 订单列表分页结果（对应后端 PageResult<OrderListItemDTO>）
 * 复用通用 PageResult 泛型，明确分页数据结构，前端订单列表组件可直接接收渲染
 */
export type OrderListPageResult = PageResult<OrderListItem>;