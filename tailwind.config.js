// tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
  // 必须包含项目中所有使用 Tailwind 类的文件路径
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 扫描 src 下所有相关文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}