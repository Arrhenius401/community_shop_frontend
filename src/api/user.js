import request from './request';

/**
 * 用户注册接口
 * @param {Object} params - 注册参数（与后端RegisterDTO对齐）
 * @param {string} params.username - 用户名（1-20位）
 * @param {string} [params.phoneNumber] - 手机号（11位数字）
 * @param {string} [params.email] - 邮箱（符合格式）
 * @param {string} params.password - 密码（含字母和数字，6-20位）
 * @param {string} params.verifyCode - 验证码（6位数字）
 * @returns {Promise<UserLoginDTO>} 注册成功后的用户登录信息（含token）
 */
export const userRegister = (params) => {
  return request.post('/api/v1/users/register', params);
};

/**
 * 账号密码登录接口
 * @param {Object} params - 登录参数（与后端LoginDTO对齐）
 * @param {string} params.account - 账号（手机号/邮箱/用户名）
 * @param {string} params.password - 密码
 * @returns {Promise<LoginResultDTO>} 登录结果（含token、用户基本信息）
 */
export const loginByPassword = (params) => {
  return request.post('/api/v1/users/login/password', params);
};

/**
 * 第三方登录接口
 * @param {Object} params - 第三方登录参数（与后端ThirdPartyLoginDTO对齐）
 * @param {string} params.thirdType - 第三方类型（WECHAT/QQ/ALIPAY）
 * @param {string} params.code - 第三方授权码
 * @returns {Promise<LoginResultDTO>} 登录结果（含token、用户基本信息）
 */
export const loginByThirdParty = (params) => {
  return request.post('/api/v1/users/login/third-party', params);
};

/**
 * 获取用户详情
 * @param {number} userId - 用户ID（路径参数）
 * @returns {Promise<UserDetailDTO>} 用户详情（脱敏后）
 */
export const getUserDetail = (userId) => {
  return request.get(`/api/v1/users/${userId}`);
};

/**
 * 更新用户资料
 * @param {Object} params - 更新参数（与后端UserProfileUpdateDTO对齐）
 * @param {string} [params.username] - 用户名
 * @param {string} [params.avatarUrl] - 头像地址
 * @param {string} [params.interestTags] - 兴趣标签（数组）
 * @returns {Promise<UserDetailDTO>} 更新后的用户详情
 */
export const updateUserProfile = (params) => {
  return request.put('/api/v1/users/profile', params);
};

/**
 * 绑定第三方账号
 * @param {Object} params - 绑定参数（与后端ThirdPartyBindDTO对齐）
 * @param {string} params.thirdType - 第三方类型（WECHAT/QQ/ALIPAY）
 * @param {string} params.code - 第三方授权码
 * @returns {Promise<boolean>} 绑定结果（true成功）
 */
export const bindThirdParty = (params) => {
  return request.post('/api/v1/users/third-party/bind', params);
};

/**
 * 查看绑定账号列表
 * @returns {Promise<ThirdPartyBindingListDTO>} 有效绑定账号列表
 */
export const getThirdPartyBindings = () => {
  return request.get('/api/v1/users/third-party/list');
};