// src/shims-vue.d.ts
// 类型声明文件
import { ComponentCustomProperties } from 'vue'
import { Router } from 'vue-router'
import { Store } from 'vuex'



declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 你的自定义全局属性
    $formatTime: (time: Date) => string
    $formatePrice: (price: number) => string

    // 确保保留 Vue 原有全局属性的类型声明
    $router: Router
    $route: RouteLocationNormalized
    $store: Store<State> // State 是你的 Vuex 状态类型
  }
}