// 导入 Pinia 核心函数
import { defineStore } from 'pinia';
// 导入前端 User 模块 DTO 类型（与后端登录接口响应对齐）
import type { LoginResult, LoginUserSimple } from '@/types/user';

// 定义并导出用户状态模块（Pinia 核心语法）
export const useUserStore = defineStore('user', {
  // 状态：存储全局共享的数据（登录态、用户信息等）
  state: () => ({
    // 从 localStorage 恢复令牌（避免页面刷新后丢失）
    token: localStorage.getItem('token') || '',
    // 令牌过期时间（毫秒时间戳，用于判断令牌是否有效）
    tokenExpireTime: Number(localStorage.getItem('tokenExpireTime')) || 0,
    // 用户简易信息（如用户ID、用户名、头像，与后端 LoginResultDTO 对齐）
    userInfo: {} as LoginUserSimple,
  }),

  // 动作：修改状态的函数（如登录、登出、更新信息）
  actions: {
    /**
     * 登录成功后存储后端返回的登录态
     * @param loginResult 后端登录接口返回的结果（与 LoginResult 类型对齐）
     */
    saveLoginState(loginResult: LoginResult) {
      this.token = loginResult.token;
      // 将后端返回的过期时间字符串（如 "2024-12-31T23:59:59"）转为毫秒时间戳
      this.tokenExpireTime = new Date(loginResult.tokenExpireTime).getTime();
      this.userInfo = loginResult.userInfo;

      // 持久化到 localStorage（避免刷新页面后状态丢失）
      localStorage.setItem('token', this.token);
      localStorage.setItem('tokenExpireTime', this.tokenExpireTime.toString());
    },

    /**
     * 登出：清除登录态（适配后端 401 未登录异常）
     */
    logout() {
      this.token = '';
      this.tokenExpireTime = 0;
      this.userInfo = {} as LoginUserSimple;

      // 清除 localStorage 中的数据
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpireTime');
    },
  },

  // 计算属性：派生状态（如判断是否登录、令牌是否有效）
  getters: {
    /**
     * 判断当前是否为登录状态（令牌存在且未过期）
     */
    isLoggedIn: (state) => {
      return !!state.token && state.tokenExpireTime > Date.now();
    },
  },
});
