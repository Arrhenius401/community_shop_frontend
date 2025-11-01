/**
 * Axios 实例封装，包含请求与响应拦截器
 * 统一处理权限令牌携带与后端 ResultVO 格式解析
 * /src/api/request.ts
 */

import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ResultVO } from '@/types/common';
import { useUserStore } from '@/stores/user'; 
import { BusinessError } from '@/utils/error';

/**
 * Axios请求返回的是一个promise对象，其中response.data对象是后端返回的真正数据
 * 调用 request.post() 本质上是发送一个 HTTP 请求，这个过程需要时间（网络传输、后端处理等），无法立即拿到结果
 * JavaScript 中处理异步操作的标准方式就是使用 Promise。
 * 
 * 通过 await 或 .then() 可以从中提取出实际的 LoginResult 数据
 * 即要从 Promise<LoginResult> 中拿到实际的 LoginResult 数据，需要通过 await 或 .then() 处理：
 */

/* response = {
  data: {},         // 后端返回的实际数据（JSON/字符串等）
  status: 200,      // HTTP状态码
  headers: {...},   // 响应头
  config: {...},    // 请求配置
  request: {...}    // 请求对象
} */

// 声明 request 实例的类型：调用 request.post<T> 时，返回 Promise<T['data']>
// 原生 axios 的类型是 Promise<AxiosResponse<T>>，需剥离一层 response.data
interface CustomAxiosInstance extends AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<T>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * 创建Axios实例，基础配置严格对齐后端Controller层规范
 * - baseURL：匹配后端接口统一前缀（文档中所有接口均以/api/v1开头）
 * - timeout：设置10秒超时（避免后端长耗时接口异常阻塞）
 * - headers：默认JSON格式，匹配后端@RequestBody接收逻辑
 */
const request: CustomAxiosInstance = axios.create({
  baseURL: 'http://localhost:8090', // 后端服务默认端口+接口前缀，适配文档规范
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

/**
 * 请求拦截器：处理权限令牌携带（适配后端@LoginRequired与@AdminRequired注解）
 * 文档规范：标注@LoginRequired的接口需在请求头添加Authorization: Bearer {token}
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    // 仅当用户已登录（存在有效token）时，添加Authorization头
    if (userStore.token && userStore.tokenExpireTime > Date.now()) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${userStore.token}`; // 格式严格匹配后端AuthInterceptor校验逻辑
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求发送前异常（如参数格式错误），直接抛出错误
    return Promise.reject(new Error(`请求准备失败：${error.message || '未知错误'}`));
  }
);

/**
 * 响应拦截器：统一解析后端ResultVO格式，匹配全局异常处理逻辑
 * 文档规范：所有接口返回ResultVO<T>，包含code/message/data/timestamp字段
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ResultVO<any>; // 明确类型为 ResultVO
    const { code, message, data, timestamp } = res;

    // 1. 成功响应：code=200（文档定义成功状态码），直接返回业务数据（ResultVO.data字段）
    if (code == "200") {
      return res.data; // 前端API调用时无需手动提取data，直接获取业务数据（如UserDetail、PostListPageResult）
    }

    // 2. 业务异常：匹配后端GlobalExceptionHandler处理的异常类型
    // 文档中定义的业务异常code：400（参数错误）、403（权限不足）等
    throw new BusinessError(code, `${message || '操作失败'}`);
  },
  (error: AxiosError) => {
    // 3. 系统异常/网络异常：匹配后端兜底异常与HTTP状态码
    const response = error.response;
    let errorMsg = '网络繁忙，请稍后再试';

    // 适配后端特定异常场景（文档中GlobalExceptionHandler定义的异常类型）
    if (response) {
      const { status, data } = response;
      // 未登录异常（401）：文档中UnLoginException对应状态码，需跳转登录页
      if (status === 401) {
        const userStore = useUserStore();
        userStore.logout(); // 清除失效登录态（token过期/无效）
        window.location.href = '/login'; // 强制跳转登录页，适配后端登录校验逻辑
        errorMsg = '登录已失效，请重新登录';
      }
      // 权限不足异常（403）：文档中NoPermissionException对应状态码
      else if (status === 403) {
        errorMsg = (data as any)?.message || '权限不足，无法执行此操作';
      }
      // 参数校验异常（400）：文档中MethodArgumentNotValidException对应状态码
      else if (status === 400) {
        errorMsg = (data as any)?.message || '参数错误，请检查输入';
      }
      // 系统异常（500）：文档中Exception兜底异常，隐藏具体堆栈信息
      else if (status === 500) {
        errorMsg = '系统繁忙，请稍后再试';
      }
    }

    // 抛出最终错误信息，供前端API调用时通过try/catch捕获
    return Promise.reject(new Error(errorMsg));
  }
);

export default request; 