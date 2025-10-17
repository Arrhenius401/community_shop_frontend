<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-medium text-gray-900">社区交易平台</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded">管理后台</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div class="flex items-center">
              <img src="/placeholder.svg?height=32&width=32" alt="Admin" class="w-8 h-8 rounded-full">
              <span class="ml-2 text-sm font-medium text-gray-700">管理员</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-medium text-gray-900 mb-6">管理控制台</h2>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">总帖子数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPosts }}</p>
              <p class="text-xs text-success mt-1">↑ 12% 较上周</p>
            </div>
            <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">总用户数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
              <p class="text-xs text-success mt-1">↑ 8% 较上周</p>
            </div>
            <div class="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">总商品数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalProducts }}</p>
              <p class="text-xs text-success mt-1">↑ 5% 较上周</p>
            </div>
            <div class="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">待处理</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.pending }}</p>
              <p class="text-xs text-gray-500 mt-1">需要关注</p>
            </div>
            <div class="w-12 h-12 bg-danger-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能入口 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a href="#posts" @click.prevent="toPostManagement" class="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
              <svg class="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">帖子管理</h3>
          <p class="text-sm text-gray-500 mb-4">管理社区帖子，审核内容，处理举报</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <span class="text-xs text-gray-500">待审核</span>
            <span class="px-2 py-0.5 text-xs font-medium bg-danger-50 text-danger rounded-full">12</span>
          </div>
        </a>

        <a href="#users" @click.prevent="toUserManagement" class="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center group-hover:bg-success group-hover:scale-110 transition-all">
              <svg class="w-6 h-6 text-success group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">用户管理</h3>
          <p class="text-sm text-gray-500 mb-4">管理用户账户，权限设置，封禁操作</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <span class="text-xs text-gray-500">今日新增</span>
            <span class="px-2 py-0.5 text-xs font-medium bg-success-50 text-success rounded-full">+8</span>
          </div>
        </a>

        <a href="#products" @click.prevent="toProductManagement" class="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center group-hover:bg-warning group-hover:scale-110 transition-all">
              <svg class="w-6 h-6 text-warning group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">商品管理</h3>
          <p class="text-sm text-gray-500 mb-4">管理商品信息，审核商品，库存管理</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <span class="text-xs text-gray-500">待审核</span>
            <span class="px-2 py-0.5 text-xs font-medium bg-warning-50 text-warning rounded-full">5</span>
          </div>
        </a>
      </div>

      <!-- 最近活动 -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-medium text-gray-900">最近活动</h3>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="activity in recentActivities" :key="activity.id" class="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="activity.bgColor">
                <svg class="w-4 h-4" :class="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="activity.iconPath"></path>
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500 mt-0.5">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        totalPosts: 0,
        totalUsers: 0,
        totalProducts: 0,
        pending: 0
      },
      recentActivities: [
        {
          id: 1,
          title: '新帖子发布',
          description: '用户 张三 发布了新帖子 "二手iPhone转让"',
          time: '5分钟前',
          bgColor: 'bg-primary-50',
          iconColor: 'text-primary',
          iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
          id: 2,
          title: '新用户注册',
          description: '用户 user_12345 完成注册',
          time: '10分钟前',
          bgColor: 'bg-success-50',
          iconColor: 'text-success',
          iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
        },
        {
          id: 3,
          title: '举报通知',
          description: '帖子 #1234 被举报为不当内容',
          time: '15分钟前',
          bgColor: 'bg-danger-50',
          iconColor: 'text-danger',
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
      ]
    }
  },
  methods: {
    async loadStats() {
      try {
        // 获取用户数
        const userRes = await queryUserCount({})
        // 获取帖子数
        const postRes = await queryPostCount({})
        // 获取待审核帖子数
        const pendingRes = await queryPostList({
          status: PostStatus.PENDING,
          pageSize: 1
        })

        // 商品数暂不获取

        this.stats.totalUsers = userRes
        this.stats.totalPosts = postRes
        this.stats.pending = pendingRes.total
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    toUserManagement() {
      // 跳转到用户管理页面的逻辑
      this.$router.push('/userManagement')
    },
    toProductManagement() {
      // 跳转到商品管理页面的逻辑
      this.$router.push('/productManagement')
    },
    toPostManagement() {
      // 暂不跳转
      this.$emit('show-toast', {
        type: 'info',
        title: '功能开发中',
        message: '帖子管理功能正在开发中'
      });
    },
  },
  mounted() {
    this.loadStats()
  }
}
</script>

<style scoped>
:root {
  --color-primary: #1E90FF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #FF6B6B;
}

.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }

.bg-primary { background-color: var(--color-primary); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-danger { background-color: var(--color-danger); }

.bg-primary-50 { background-color: rgba(30, 144, 255, 0.1); }
.bg-success-50 { background-color: rgba(16, 185, 129, 0.1); }
.bg-warning-50 { background-color: rgba(245, 158, 11, 0.1); }
.bg-danger-50 { background-color: rgba(255, 107, 107, 0.1); }

.text-primary-600 { color: #1E90FF; }
.border-primary { border-color: var(--color-primary); }
.hover\:border-primary:hover { border-color: var(--color-primary); }
</style>