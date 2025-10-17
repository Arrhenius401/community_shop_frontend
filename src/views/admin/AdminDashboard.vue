<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     顶部导航栏 
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">社区交易</router-link>
          <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">管理后台</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button 
              @click="showNotifications = !showNotifications"
              class="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div v-if="showNotifications" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div class="py-2 px-4 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-700">通知</h3>
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div class="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                  <p class="text-sm font-medium text-gray-800">新用户注册</p>
                  <p class="text-xs text-gray-500">用户 user123 刚刚注册了账号</p>
                  <p class="text-xs text-gray-400 mt-1">2分钟前</p>
                </div>
                <div class="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                  <p class="text-sm font-medium text-gray-800">帖子被举报</p>
                  <p class="text-xs text-gray-500">帖子 #1234 被举报为垃圾内容</p>
                  <p class="text-xs text-gray-400 mt-1">15分钟前</p>
                </div>
              </div>
              <div class="py-2 px-4 border-t border-gray-200 text-center">
                <button class="text-xs text-blue-600 hover:text-blue-800">查看全部通知</button>
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <img src="/placeholder.svg?height=32&width=32" alt="Admin" class="w-8 h-8 rounded-full mr-2">
            <div>
              <p class="text-sm font-medium text-gray-700">管理员</p>
            </div>
            <div class="relative ml-2">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div v-if="showUserMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</router-link>
                  <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">系统设置</router-link>
                  <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">退出登录</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

     主内容区 
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">管理控制台</h1>
      
       统计卡片 
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">总帖子数</p>
              <p class="text-2xl font-semibold">1,248</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">总用户数</p>
              <p class="text-2xl font-semibold">856</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 mr-4">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">总商品数</p>
              <p class="text-2xl font-semibold">342</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 mr-4">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">待处理举报</p>
              <p class="text-2xl font-semibold">7</p>
            </div>
          </div>
        </div>
      </div>

       管理模块导航卡片 
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          to="/admin/posts"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-blue-100 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">帖子管理</h3>
          <p class="text-gray-600 text-sm mb-4">管理社区帖子，审核内容，处理举报</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">待审核</span>
            <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">12</span>
          </div>
        </router-link>

        <router-link 
          to="/admin/users"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-green-500"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-green-100 rounded-full">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">用户管理</h3>
          <p class="text-gray-600 text-sm mb-4">管理用户账户，权限设置，封禁操作</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">今日新增</span>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">+8</span>
          </div>
        </router-link>

        <router-link 
          to="/admin/products"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-purple-500"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-purple-100 rounded-full">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">商品管理</h3>
          <p class="text-gray-600 text-sm mb-4">管理商品信息，审核商品，库存管理</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">待审核</span>
            <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">5</span>
          </div>
        </router-link>
      </div>

       最近活动 
      <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">最近活动</h2>
        <div class="space-y-4">
          <div class="flex items-start border-l-4 border-blue-500 pl-4 py-2">
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">新帖子发布</p>
              <p class="text-xs text-gray-500">用户 张三 发布了新帖子 "二手iPhone转让"</p>
              <p class="text-xs text-gray-400 mt-1">5分钟前</p>
            </div>
          </div>
          
          <div class="flex items-start border-l-4 border-green-500 pl-4 py-2">
            <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">新用户注册</p>
              <p class="text-xs text-gray-500">用户 user_12345 完成注册</p>
              <p class="text-xs text-gray-400 mt-1">10分钟前</p>
            </div>
          </div>
          
          <div class="flex items-start border-l-4 border-red-500 pl-4 py-2">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">举报通知</p>
              <p class="text-xs text-gray-500">帖子 #1234 被举报为不当内容</p>
              <p class="text-xs text-gray-400 mt-1">15分钟前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      showNotifications: false,
      showUserMenu: false
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdowns)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdowns)
  },
  methods: {
    closeDropdowns() {
      this.showNotifications = false
      this.showUserMenu = false
    },
    logout() {
      localStorage.removeItem('userToken')
      localStorage.removeItem('userInfo')
      this.$router.push('/login')
    }
  }
}
</script>
