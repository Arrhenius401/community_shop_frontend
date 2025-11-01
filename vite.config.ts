// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  // 项目根目录（可选，默认当前目录）
  root: path.resolve(__dirname, './'),
  
  // 开发服务器配置（对应原 devServer）
  server: {
    port: 8070,  // 前端端口，保持与原配置一致
    proxy: {
      // 代理配置：匹配以 "/api" 开头的请求
      '/api': {  // 修正原配置的匹配规则（添加前缀 /）
        target: 'http://localhost:8090',  // 后端端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // 路径重写（Vite 用 rewrite 而非 pathRewrite）
      }
    }
  },
  
  // 构建配置（对应原 build）
  build: {
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
    vue()  // 加载 Vue 插件
  ],
  
  // 路径别名配置（可选，类似 Vue CLI 的 chainWebpack 别名）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 例如：@ 指向 src 目录
    }
  },
})