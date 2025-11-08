// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  // 项目根目录（可选，默认当前目录）
  root: path.resolve(__dirname, './'),
  
  // 开发服务器配置（对应原 devServer）
  server: {
    https: true, // 关键：开启 HTTPS 服务
    port: 8070,  // 前端端口，保持与原配置一致
    host: '0.0.0.0', // 支持局域网访问（可选，如手机调试）
    proxy: {
      // 代理配置：匹配以 "/api" 开头的请求
      '/api': {  // 修正原配置的匹配规则（添加前缀 /）
        target: 'https://localhost:8090',  // 后端端口 HTTPS 地址（不是 http！）
        changeOrigin: true,
        secure: false, // 允许代理到自签名证书的后端（开发阶段必需）
        rewrite: (path) => path.replace(/^\/api/, '')  // 路径重写（Vite 用 rewrite 而非 pathRewrite）
      }
    }
  },
  
  // 构建配置（对应原 build）
  build: {
    outDir: 'dist',  // 编译输出目录（默认dist）
    assetsDir: 'static',  // 静态资源目录（CSS/JS/图片）
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  
  // CSS 配置
  css: {
    postcss: {
      plugins: [
        tailwindcss(),  // 移除require，直接使用导入的变量
        autoprefixer()  // 移除require，直接使用导入的变量
      ]
    }
  },

  // 插件配置
  plugins: [
    vue(),  // 加载 Vue 插件
    basicSsl() // 启用 HTTPS 插件（自动生成证书）
  ],
  
  // 路径别名配置（可选，类似 Vue CLI 的 chainWebpack 别名）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 例如：@ 指向 src 目录
    }
  },
})