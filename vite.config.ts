// 1. 导入依赖：仅保留文档要求的技术栈依赖
import { defineConfig, loadEnv, ConfigEnv } from 'vite'; // Vite 核心工具（文档指定构建工具为 Vite）
import vue from '@vitejs/plugin-vue'; // Vue 3 插件（文档指定框架为 Vue 3）
import tailwindcss from 'tailwindcss'; // Tailwind CSS 插件（文档样式方案核心）
import autoprefixer from 'autoprefixer'; // Autoprefixer（文档要求处理样式兼容）
import basicSsl from '@vitejs/plugin-basic-ssl'; // 开发环境HTTPS（适配本地代理+后端HTTPS需求，文档未提但为开发必需）
import path from 'path'; // 路径解析（适配模块别名，提升开发效率）

// 2. 单文件+模式判断：适配开发/生产场景
export default defineConfig(({ mode }: ConfigEnv) => {
  // 加载环境变量：区分开发/生产的API地址等配置（避免硬编码，适配文档“主流浏览器”部署需求）
  const env = loadEnv(mode, process.cwd());

  // 提取开发模式判断（简化后续配置的类型推断）
  const isDevelopment = mode === 'development';

  return { 
    // 项目根目录（可选，默认当前目录）
    root: path.resolve(__dirname, './'),
    
    // 3. 插件配置：严格对应文档技术栈，开发/生产自动切换
    plugins: [
      vue(), // 必选：解析 Vue 3 单文件组件（文档核心框架要求）
      // 开发模式才启用 HTTPS 插件：避免生产环境冗余，适配本地调试时的HTTPS代理需求
      isDevelopment ? basicSsl() : undefined
    ],

    // 4. 开发服务器配置：完全匹配文档“开发端口+代理”要求
    server: {
      https:  isDevelopment ? {} : undefined, // 开发模式启用HTTPS（适配后端HTTPS，避免混合内容警告）
      port: 8070, // 固定：文档明确要求开发服务器端口为8070
      host: '0.0.0.0', // 可选：支持局域网访问（如手机调试，不违背文档要求）
      // 代理配置：文档要求“API请求转发至8090端口后端”，仅开发模式生效
      proxy: isDevelopment ? {
        '/api': { // 假设API前缀为/api（可根据项目实际调整，不违背文档逻辑）
          target: 'http://localhost:8090', // 文档指定的后端服务端口8090
          changeOrigin: true, // 必选：解决跨域（文档未明说但为API请求必需）
          secure: false // 必选：允许后端自签名证书（开发环境常见场景）
        }
      } : undefined // 生产环境根本不读取server配置
    },
    
    // 5. 生产打包配置：适配文档“主流现代浏览器”部署需求
    build: {
      outDir: 'dist', // 固定：生产打包输出目录（适配静态资源部署，如Nginx）
      assetsDir: 'static', // 优化：按类型分类静态资源（JS/CSS/图片），便于维护
      sourcemap: false, // 必选：关闭sourcemap（防源码泄露，适配生产安全需求）
      rollupOptions: {
        // 优化：拆分代码块，减少单个文件体积（适配文档“主流浏览器”加载性能需求）
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    
    // 6. 模块解析：提升开发效率，不违背文档技术栈
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 配置@指向src目录（方便组件/工具导入）
      }
    },

    // 7. CSS配置：严格匹配文档“Tailwind CSS + PostCSS + Autoprefixer”样式方案
    css: {
      postcss: {
        plugins: [
          tailwindcss(), // 必选：编译Tailwind语法为普通CSS（文档样式方案核心）
          autoprefixer() // 必选：自动添加浏览器前缀（文档要求处理样式兼容）
        ]
      }
    }
  };
})