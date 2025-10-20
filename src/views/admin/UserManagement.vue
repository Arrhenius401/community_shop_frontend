<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <button @click="goBack" class="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-xl font-medium text-gray-900">用户管理</h1>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="用户名、ID或邮箱" 
              @keyup.enter="searchUsers"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">全部状态</option>
            <option :value="UserStatus.NORMAL">正常</option>
            <option :value="UserStatus.BANNED">封禁中</option>
            <option :value="UserStatus.INACTIVE">未激活</option>
          </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
            <select v-model="filters.role" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部角色</option>
              <option :value="UserRole.USER">普通用户</option>
              <option :value="UserRole.ADMIN">管理员</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">每页数量</label>
            <select v-model="pageSize" @change="searchUsers" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option :value="10">10条/页</option>
              <option :value="20">20条/页</option>
              <option :value="50">50条/页</option>
            </select>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="searchUsers" :disabled="loading" class="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? '检索中...' : '检索' }}
          </button>
          <button @click="resetFilters" class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            重置
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading && users.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p class="text-sm text-gray-500">正在加载数据...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && users.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <p class="text-sm text-gray-500">暂无数据</p>
        <p class="text-xs text-gray-400 mt-1">请尝试调整筛选条件</p>
      </div>

      <!-- 用户列表 -->
      <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系方式</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.userId" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ user.userId }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="user.avatarUrl" :alt="user.username" class="h-8 w-8 rounded-full">
                    <span class="ml-2 text-sm font-medium text-gray-900">{{ user.username }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  <div>{{ user.email }}</div>
                  <div class="text-xs text-gray-400">{{ user.phoneNumber }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ user.createTime }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span 
                    :class="user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'" 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ roleMap[user.role] }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span 
                    :class="user.status === UserStatus.NORMAL ? 'bg-green-50 text-green-700' : 
                            user.status === UserStatus.BANNED ? 'bg-red-50 text-red-700' : 
                            'bg-yellow-50 text-yellow-700'" 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ statusMap[user.status] }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="viewUser(user)" class="text-primary hover:text-blue-700 mr-3">查看</button>
                  <button @click="toggleBan(user)" :class="user.status === UserStatus.NORMAL ? 'text-danger hover:text-red-700' : 'text-success hover:text-green-700'">
                    {{ user.status === UserStatus.NORMAL ? '封禁' : '解封' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - <span class="font-medium">{{ Math.min(currentPage * pageSize, totalCount) }}</span> 条，共 <span class="font-medium">{{ totalCount }}</span> 条
          </div>
          <div class="flex items-center space-x-2">
            <button @click="goToPage(1)" :disabled="currentPage === 1 || loading" class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              首页
            </button>
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1 || loading" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <span class="px-3 py-1.5 text-sm text-gray-700">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages || loading" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
            </button>
            <button @click="goToPage(totalPages)" :disabled="currentPage >= totalPages || loading" class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              末页
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 详情模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">用户详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedUser">
          <div class="flex items-center mb-6">
            <img :src="selectedUser.avatarUrl" :alt="selectedUser.username" class="h-16 w-16 rounded-full">
            <div class="ml-4">
              <h2 class="text-xl font-medium text-gray-900">{{ selectedUser.username }}</h2>
              <div class="flex items-center mt-2 space-x-2">
                <span :class="selectedUser.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedUser.role === UserRole.ADMIN ? '管理员' : '普通用户' }}
                </span>
                <span :class="selectedUser.status === UserStatus.NORMAL ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedUser.status === UserStatus.NORMAL ? '正常' : '已封禁' }}
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p class="text-xs text-gray-500 mb-1">用户ID</p>
              <p class="text-sm text-gray-900">#{{ selectedUser.userId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">注册时间</p>
              <p class="text-sm text-gray-900">{{ selectedUser.createTime }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">邮箱</p>
              <p class="text-sm text-gray-900">{{ selectedUser.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">手机号</p>
              <p class="text-sm text-gray-900">{{ selectedUser.phoneNumber }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              关闭
            </button>
            <button @click="toggleBan(selectedUser); showModal = false" :class="selectedUser.status === UserStatus.NORMAL ? 'bg-danger hover:bg-red-700' : 'bg-success hover:bg-green-700'" class="px-4 py-2 text-sm font-medium text-white rounded-lg">
              {{ selectedUser.status === UserStatus.NORMAL ? '封禁用户' : '解除封禁' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { queryUserList, updateUserStatus } from '@/api/user';
import { UserRole, UserStatus, UserQueryParams, UserListItem } from '@/types/user';

export default {
  data() {
    return {
      filters: {
        search: '',
        status: '',
        role: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      showModal: false,
      selectedUser: {} as UserListItem,
      users: [] as UserListItem[],
      // 显示声明可访问的枚举
      UserRole,
      UserStatus,
      // 新增枚举映射用于模板显示
      roleMap: {
        [UserRole.USER]: '普通用户',
        [UserRole.ADMIN]: '管理员'
      },
      statusMap: {
        [UserStatus.NORMAL]: '正常',
        [UserStatus.BANNED]: '封禁中',
        [UserStatus.INACTIVE]: '未激活',
        [UserStatus.DELETED]: '已删除'
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    }
  },
  mounted() {
    this.searchUsers()
  },
  methods: {
    async searchUsers() {
      this.loading = true
      this.currentPage = 1
      await this.fetchUsers()
    },
    async fetchUsers() {
      try {
        // 构建查询参数
        const params: UserQueryParams = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          status: this.filters.status as UserStatus,
          role: this.filters.role as UserRole,
          // 处理搜索逻辑（根据实际后端支持的搜索字段调整）
          filterField: this.filters.search ? 'username' : undefined,
          filterValue: this.filters.search || undefined
        };

        const response = await queryUserList(params);
        this.users = response.list as UserListItem[];
        this.totalCount = response.total;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        alert('获取用户列表失败，请重试');
      } finally {
        this.loading = false;
      }
    },
    async goToPage(page: number) {
      if (page < 1 || page > this.totalPages || this.loading) return
      this.currentPage = page
      await this.fetchUsers()
    },
    resetFilters() {
      this.filters = { search: '', status: '', role: '' }
      this.searchUsers()
    },
    goBack() {
      alert('返回管理面板')
    },
    viewUser(user: UserListItem) {
      this.selectedUser = user
      this.showModal = true
    },
    async toggleBan(user: UserListItem) {
      const parqams = {
        userId: user.userId,
        status: user.status === UserStatus.NORMAL ? UserStatus.BANNED : UserStatus.NORMAL
      }

      try {
        await updateUserStatus(parqams)
        await this.fetchUsers()
        alert(`用户 ${user.username} 已${user.status === UserStatus.NORMAL ? '解除封禁' : '封禁'}`)
      } catch (error) {
        console.error('修改用户状态失败:', error);
        alert('修改用户状态失败，请重试');
      }
    }
  }
}
</script>

<style scoped>
.text-primary { color: #1E90FF; }
.text-danger { color: #FF6B6B; }
.text-success { color: #10B981; }
.bg-primary { background-color: #1E90FF; }
.bg-danger { background-color: #FF6B6B; }
.bg-success { background-color: #10B981; }
.focus\:ring-primary:focus { --tw-ring-color: #1E90FF; }
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>