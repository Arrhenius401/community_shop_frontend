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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="用户名、ID或邮箱" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部状态</option>
              <option value="active">正常</option>
              <option value="banned">已封禁</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
            <select v-model="filters.role" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部角色</option>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="resetFilters" class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              重置筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ user.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="user.avatar" :alt="user.username" class="h-8 w-8 rounded-full">
                    <span class="ml-2 text-sm font-medium text-gray-900">{{ user.username }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  <div>{{ user.email }}</div>
                  <div class="text-xs text-gray-400">{{ user.phone }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ user.registerTime }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.status === 'active' ? '正常' : '已封禁' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="viewUser(user)" class="text-primary hover:text-blue-700 mr-3">查看</button>
                  <button @click="toggleBan(user)" :class="user.status === 'active' ? 'text-danger hover:text-red-700' : 'text-success hover:text-green-700'">
                    {{ user.status === 'active' ? '封禁' : '解封' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - <span class="font-medium">{{ Math.min(currentPage * pageSize, totalUsers) }}</span> 条，共 <span class="font-medium">{{ totalUsers }}</span> 条
          </div>
          <div class="flex space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <button @click="nextPage" :disabled="currentPage * pageSize >= totalUsers" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
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
            <img :src="selectedUser.avatar" :alt="selectedUser.username" class="h-16 w-16 rounded-full">
            <div class="ml-4">
              <h2 class="text-xl font-medium text-gray-900">{{ selectedUser.username }}</h2>
              <div class="flex items-center mt-2 space-x-2">
                <span :class="selectedUser.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedUser.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
                <span :class="selectedUser.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedUser.status === 'active' ? '正常' : '已封禁' }}
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p class="text-xs text-gray-500 mb-1">用户ID</p>
              <p class="text-sm text-gray-900">#{{ selectedUser.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">注册时间</p>
              <p class="text-sm text-gray-900">{{ selectedUser.registerTime }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">邮箱</p>
              <p class="text-sm text-gray-900">{{ selectedUser.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">手机号</p>
              <p class="text-sm text-gray-900">{{ selectedUser.phone }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              关闭
            </button>
            <button @click="toggleBan(selectedUser); showModal = false" :class="selectedUser.status === 'active' ? 'bg-danger hover:bg-red-700' : 'bg-success hover:bg-green-700'" class="px-4 py-2 text-sm font-medium text-white rounded-lg">
              {{ selectedUser.status === 'active' ? '封禁用户' : '解除封禁' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      showModal: false,
      selectedUser: null,
      users: [
        { id: 2001, username: '张三', avatar: '/placeholder.svg?height=32&width=32', email: 'zhangsan@example.com', phone: '138-1234-5678', registerTime: '2023-06-15', role: 'user', status: 'active' },
        { id: 2002, username: '李四', avatar: '/placeholder.svg?height=32&width=32', email: 'lisi@example.com', phone: '139-8765-4321', registerTime: '2023-07-20', role: 'user', status: 'active' },
        { id: 2003, username: '王五', avatar: '/placeholder.svg?height=32&width=32', email: 'wangwu@example.com', phone: '136-5555-6666', registerTime: '2023-08-10', role: 'admin', status: 'active' },
        { id: 2004, username: '赵六', avatar: '/placeholder.svg?height=32&width=32', email: 'zhaoliu@example.com', phone: '137-7777-8888', registerTime: '2023-09-05', role: 'user', status: 'banned' },
        { id: 2005, username: '孙七', avatar: '/placeholder.svg?height=32&width=32', email: 'sunqi@example.com', phone: '135-9999-0000', registerTime: '2023-10-12', role: 'user', status: 'active' },
      ]
    }
  },
  computed: {
    filteredUsers() {
      let result = [...this.users]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(user => 
          user.username.toLowerCase().includes(search) || 
          user.id.toString().includes(search) ||
          user.email.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.status) {
        result = result.filter(user => user.status === this.filters.status)
      }
      
      if (this.filters.role) {
        result = result.filter(user => user.role === this.filters.role)
      }
      
      return result
    },
    totalUsers() {
      return this.filteredUsers.length
    }
  },
  methods: {
    goBack() {
      alert('返回管理面板')
    },
    resetFilters() {
      this.filters = { search: '', status: '', role: '' }
    },
    viewUser(user) {
      this.selectedUser = user
      this.showModal = true
    },
    toggleBan(user) {
      user.status = user.status === 'active' ? 'banned' : 'active'
      alert(`用户 ${user.username} 已${user.status === 'active' ? '解除封禁' : '封禁'}`)
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage * this.pageSize < this.totalUsers) this.currentPage++
    }
  }
}
</script>

<style scoped>
.text-primary { color: #1E90FF; }
.text-danger { color: #FF6B6B; }
.text-success { color: #10B981; }
.bg-danger { background-color: #FF6B6B; }
.bg-success { background-color: #10B981; }
.focus\:ring-primary:focus { --tw-ring-color: #1E90FF; }
</style>