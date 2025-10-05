export class BusinessError extends Error {
  code: string; // 存储后端返回的 String 类型错误码

  constructor(code: string, message: string) {
    super(message);
    this.name = 'BusinessError'; // 用于区分错误类型
    this.code = code; // 保存错误码
  }
}