// 错误码类型定义
interface ErrorCodeItem {
  code: string;
  message: string;
}

// 错误码映射表（与后端枚举保持一致）
const ErrorCodeMap: Record<string, ErrorCodeItem> = {
  // 通用错误
  SUCCESS: { code: "SYSTEM_000", message: "操作成功" },
  FAILURE: { code: "SYSTEM_001", message: "操作失败" },
  PARAM_ERROR: { code: "SYSTEM_002", message: "参数错误" },
  PARAM_NULL: { code: "SYSTEM_003", message: "参数为空" },
  NOT_FOUND: { code: "SYSTEM_004", message: "资源不存在" },
  RELATED_DATA_MISSING: { code: "SYSTEM_005", message: "缺少关联数据" },
  DATA_UPDATE_FAILED: { code: "SYSTEM_011", message: "数据更新失败" },
  DATA_DELETE_FAILED: { code: "SYSTEM_012", message: "数据删除失败" },
  DATA_INSERT_FAILED: { code: "SYSTEM_013", message: "数据插入失败" },
  DATA_QUERY_FAILED: { code: "SYSTEM_014", message: "数据查询失败" },
  PERMISSION_UNAUTHORIZED: { code: "SYSTEM_021", message: "未认证" },
  PERMISSION_DENIED: { code: "SYSTEM_022", message: "无权限" },
  OPERATION_REPEAT: { code: "SYSTEM_051", message: "操作重复" },
  SYSTEM_ERROR: { code: "SYSTEM_100", message: "系统错误" },

  // 用户模块
  USER_EXISTS: { code: "USER_001", message: "用户已存在" },
  EMAIL_EXISTS: { code: "USER_002", message: "邮箱已被注册" },
  PHONE_EXISTS: { code: "USER_003", message: "手机号已被注册" },
  USERNAME_EXISTS: { code: "USER_004", message: "用户名已存在" },
  PASSWORD_CONFIRM_NOT_MATCH: { code: "USER_005", message: "密码确认不一致" },
  OLD_PASSWORD_ERROR: { code: "USER_006", message: "旧密码错误" },
  EMAIL_NULL: { code: "USER_011", message: "邮箱为空" },
  PHONE_NULL: { code: "USER_012", message: "手机号为空" },
  USERNAME_NULL: { code: "USER_013", message: "用户名为空" },
  ROLE_NULL: { code: "USER_014", message: "用户角色为空" },
  USER_ID_NULL: { code: "USER_015", message: "用户ID为空" },
  PASSWORD_NULL: { code: "USER_016", message: "密码为空" },
  ROLE_INVALID: { code: "USER_021", message: "用户角色参数错误" },
  STATUS_INVALID: { code: "USER_022", message: "用户状态参数错误" },
  USERNAME_FORMAT_INVALID: { code: "USER_023", message: "用户名格式错误" },
  PHONE_FORMAT_INVALID: { code: "USER_024", message: "手机号格式错误" },
  EMAIL_FORMAT_INVALID: { code: "USER_025", message: "邮箱格式错误" },
  PASSWORD_FORMAT_INVALID: { code: "USER_027", message: "密码格式错误" },
  USERNAME_LENGTH_INVALID: { code: "USER_028", message: "用户名长度错误" },
  AVATAR_URL_FORMAT_INVALID: { code: "USER_029", message: "头像URL格式错误" },
  VERIFY_CODE_INVALID: { code: "USER_030", message: "验证码错误" },
  USER_NOT_EXISTS: { code: "USER_051", message: "用户不存在" },
  PASSWORD_ERROR: { code: "USER_052", message: "密码错误" },
  CREDIT_TOO_LOW: { code: "USER_081", message: "用户积分不足" },

  // 用户第三方绑定相关
  THIRD_AUTH_FAILED: { code: "USER_071", message: "第三方授权失败" },
  THIRD_SYSTEM_ERROR: { code: "USER_072", message: "第三方系统错误" },
  USER_THIRD_PARTY_UNBIND_FAILED: { code: "USER_073", message: "第三方账号解绑失败" },
  USER_THIRD_PARTY_NOT_EXISTS: { code: "USER_074", message: "第三方账号绑定记录不存在" },
  USER_THIRD_PARTY_NOT_BOUND: { code: "USER_075", message: "第三方账号未绑定" },
  USER_THIRD_PARTY_BIND_FAILED: { code: "USER_076", message: "第三方账号绑定失败" },

  // 帖子模块
  POST_NOT_EXISTS: { code: "POST_001", message: "帖子不存在" },
  POST_TITLE_NULL: { code: "POST_002", message: "帖子标题为空" },
  POST_CONTENT_NULL: { code: "POST_003", message: "帖子内容为空" },
  POST_ID_NULL: { code: "POST_004", message: "帖子ID为空" },
  POST_STATUS_ERROR: { code: "POST_005", message: "帖子状态参数错误" },
  POST_STATUS_INVALID: { code: "POST_021", message: "帖子状态参数错误" },
  POST_TITLE_INVALID: { code: "POST_022", message: "帖子标题不符合规范" },
  POST_CONTENT_INVALID: { code: "POST_023", message: "帖子内容不符合规范" },
  POST_IMAGE_FORMAT_INVALID: { code: "POST_024", message: "帖子图片格式错误" },
  POST_IMAGE_TOO_MANY: { code: "POST_031", message: "帖子图片数量过多" },
  POST_ALREADY_DELETED: { code: "POST_051", message: "帖子已删除" },
  TOP_POST_COUNT_EXCEED: { code: "POST_071", message: "帖子置顶数量超出限制" },
  DAILY_LIKE_TIMES_EXCEED: { code: "POST_072", message: "用户每天点赞次数超出限制" },
  POST_STATUS_ABNORMAL: { code: "POST_073", message: "帖子状态异常" },
  USER_NOT_LIKED_POST: { code: "POST_081", message: "用户未点赞该帖子" },
  POST_LIKE_COUNT_UPDATE_FAILED: { code: "POST_074", message: "帖子点赞数量更新失败" },

  // 帖子跟帖模块
  POST_FOLLOW_NOT_EXISTS: { code: "POST_FOLLOW_001", message: "跟帖不存在" },
  POST_FOLLOW_CONTENT_NULL: { code: "POST_FOLLOW_002", message: "跟帖内容为空" },
  POST_FOLLOW_ID_NULL: { code: "POST_FOLLOW_003", message: "跟帖ID为空" },
  POST_FOLLOW_STATUS_ERROR: { code: "POST_FOLLOW_004", message: "跟帖状态参数错误" },
  POST_FOLLOW_CONTENT_ILLEGAL: { code: "POST_FOLLOW_011", message: "跟帖内容不符合规范" },
  FOLLOW_STATUS_ILLEGAL: { code: "POST_FOLLOW_012", message: "跟帖状态参数错误" },

  // 商品模块
  PRODUCT_NOT_EXISTS: { code: "PRODUCT_001", message: "商品不存在" },
  PRODUCT_TITLE_NULL: { code: "PRODUCT_002", message: "商品标题为空" },
  PRODUCT_PRICE_NULL: { code: "PRODUCT_003", message: "商品价格为空" },
  PRODUCT_ID_NULL: { code: "PRODUCT_004", message: "商品ID为空" },
  PRODUCT_CATEGORY_NULL: { code: "PRODUCT_005", message: "商品分类为空" },
  PRODUCT_TITLE_INVALID: { code: "PRODUCT_011", message: "商品标题不符合规范" },
  PRODUCT_STATUS_INVALID: { code: "PRODUCT_012", message: "商品状态参数错误" },
  PRODUCT_CONDITION_INVALID: { code: "PRODUCT_013", message: "商品成色参数错误" },
  PRODUCT_PRICE_INVALID: { code: "PRODUCT_014", message: "商品价格参数错误" },
  PRODUCT_STOCK_INVALID: { code: "PRODUCT_015", message: "商品库存参数错误" },
  PRODUCT_IMAGE_URL_INVALID: { code: "PRODUCT_016", message: "商品图片URL参数错误" },
  PRODUCT_DESCRIPTION_TOO_LONG: { code: "PRODUCT_021", message: "商品描述过长" },
  PRODUCT_IMAGE_TOO_MANY: { code: "PRODUCT_022", message: "商品图片数量过多" },
  PRODUCT_ALREADY_OFF_SALE: { code: "PRODUCT_091", message: "商品已下架" },
  PRODUCT_STOCK_INSUFFICIENT: { code: "PRODUCT_092", message: "商品库存不足" },
  ORDER_AMOUNT_ABNORMAL: { code: "ORDER_021", message: "订单金额异常" },

  // 订单模块
  ORDER_NOT_EXISTS: { code: "ORDER_001", message: "订单不存在" },
  ORDER_ID_NULL: { code: "ORDER_002", message: "订单ID为空" },
  ORDER_AMOUNT_NULL: { code: "ORDER_003", message: "订单金额为空" },
  ORDER_STATUS_NULL: { code: "ORDER_004", message: "订单状态为空" },
  ORDER_BUYER_NULL: { code: "ORDER_005", message: "订单买家为空" },
  ORDER_SELLER_NULL: { code: "ORDER_006", message: "订单卖家为空" },
  ORDER_STATUS_INVALID: { code: "ORDER_004", message: "订单状态参数错误" },
  STOCK_INSUFFICIENT: { code: "ORDER_021", message: "商品库存不足" },
  ORDER_STATUS_NOT_COMPLETED: { code: "ORDER_005", message: "订单未完成" },

  // 评价模块
  EVALUATION_NOT_EXISTS: { code: "EVAL_001", message: "评价不存在" },
  EVALUATION_ID_NULL: { code: "EVAL_002", message: "评价ID为空" },
  EVALUATION_CONTENT_NULL: { code: "EVAL_003", message: "评价内容为空" },
  EVALUATION_SCORE_NULL: { code: "EVAL_004", message: "评价分数为空" },
  EVALUATION_ORDER_ID_NULL: { code: "EVAL_005", message: "评价订单ID为空" },
  EVALUATION_REPORT_REASON_NULL: { code: "EVAL_006", message: "评价举报理由为空" },
  EVALUATION_SCORE_INVALID: { code: "EVAL_021", message: "评价分数参数错误" },
  EVALUATION_CONTENT_INVALID: { code: "EVAL_022", message: "评价内容参数错误" },
  EVALUATION_IMAGE_URL_INVALID: { code: "EVAL_023", message: "评价图片URL参数错误" },
  EVALUATION_TAGS_INVALID: { code: "EVAL_024", message: "评价标签参数错误" },
  EVALUATION_STATUS_INVALID: { code: "EVAL_025", message: "评价状态参数错误" },
  EVALUATION_REPORT_REASON_TOO_LONG: { code: "EVAL_041", message: "评价举报理由过长" },
  ORDER_ALREADY_EVALUATED: { code: "EVAL_091", message: "订单已评价" },
  SELLER_NOT_EXISTS: { code: "MSG_002", message: "卖家不存在" },

  // 消息模块
  MESSAGE_NOT_EXISTS: { code: "MSG_001", message: "消息不存在" },
  MESSAGE_ID_NULL: { code: "MSG_002", message: "消息ID为空" },
  MESSAGE_CONTENT_NULL: { code: "MSG_003", message: "消息内容为空" },
  MESSAGE_RECEIVER_NULL: { code: "MSG_004", message: "消息接收者为空" },
  MESSAGE_SENDER_NULL: { code: "MSG_005", message: "消息发送者为空" },
  MESSAGE_TYPE_NULL: { code: "MSG_006", message: "消息类型为空" },
  MESSAGE_TYPE_INVALID: { code: "MSG_005", message: "消息类型参数错误" },
  MESSAGE_STATUS_INVALID: { code: "MSG_006", message: "消息状态参数错误" },
  MESSAGE_CONTENT_INVALID: { code: "MSG_007", message: "消息内容参数错误" },
  RECEIVER_NOT_EXISTS: { code: "MSG_011", message: "接收者不存在" },
  SENDER_NOT_EXISTS: { code: "MSG_012", message: "发送者不存在" },
  MESSAGE_STATUS_TRANSITION_INVALID: { code: "MSG_004", message: "消息状态转换错误" },

  // QA模块
  QA_ID_NULL: { code: "QA_001", message: "QA记录ID为空" },
  QA_QUESTION_TEXT_NULL: { code: "QA_002", message: "QA问题内容为空" },
  QA_NOT_EXISTS: { code: "QA_003", message: "QA记录不存在" },

  // Log模块
  LOG_NOT_EXISTS: { code: "LOG_001", message: "日志记录不存在" },
  LOG_TARGET_ID_NULL: { code: "LOG_002", message: "日志目标ID为空" },
  LOG_TARGET_TYPE_NULL: { code: "LOG_003", message: "日志目标类型为空" },
  LOG_ACTION_TYPE_NULL: { code: "LOG_004", message: "日志操作类型为空" },
  LOG_TARGET_TYPE_INVALID: { code: "LOG_005", message: "日志目标类型参数错误" },
  LOG_ACTION_TYPE_INVALID: { code: "LOG_006", message: "日志操作类型参数错误" },

  // 邮件模块
  MAIL_SEND_FAILS: { code: "MAIL_001", message: "邮件发送失败" },
  MAIL_REDIS_BREAK: { code: "MAIL_002", message: "Redis异常" },
  MAIL_SEND_FAILS_TOO_MANY_TIMES: { code: "MAIL_003", message: "邮件发送失败次数过多" },
  MAIL_VERIFICATION_CODE_EXPIRED: { code: "MAIL_004", message: "邮件验证码已过期" },
  MAIL_VERIFICATION_CODE_INVALID: { code: "MAIL_005", message: "邮件验证码无效" },
  MAIL_VERIFICATION_CODE_NOT_EXISTS: { code: "MAIL_006", message: "邮件验证码不存在" },
  MAIL_VERIFICATION_CODE_NOT_MATCH: { code: "MAIL_007", message: "邮件验证码不匹配" }
};

// 错误码键值类型（用于类型提示）
type ErrorCodeKey = keyof typeof ErrorCodeMap;

export { ErrorCodeMap, type ErrorCodeKey, type ErrorCodeItem };