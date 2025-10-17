<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     顶部导航栏 
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center">
          <router-link to="/admin" class="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900">用户管理</h1>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-6">
       搜索和筛选 
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="输入ID、用户名或邮箱搜索" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select 
              v-model="filters.status" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">全部状态</option>
              <option value="NORMAL">正常</option>
              <option value="BANNED">已封禁</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">排序方式</label>
            <div class="flex space-x-2">
              <select 
                v-model="sorting.field" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="userID">ID</option>
                <option value="username">用户名</option>
                <option value="initDate">注册时间</option>
              </select>
              <button 
                @click="sorting.order = sorting.order === 'asc' ? 'desc' : 'asc'" 
                class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg v-if="sorting.order === 'asc'" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

       用户列表 
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.userID" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.userID }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="user.profilePicture || '/placeholder.svg?height=40&width=40'" alt="">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div>{{ user.email }}</div>
                  <div>{{ formatPhone(user.phoneNumber) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.initDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ user.role === 'ROLE_ADMIN' ? '管理员' : '普通用户' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.status === 'NORMAL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-900">查看</button>
                    <button 
                      v-if="user.status === 'NORMAL'"
                      @click="changeStatus(user.userID, 'BANNED')" 
                      class="text-red-600 hover:text-red-900"
                    >
                      封禁
                    </button>
                    <button 
                      v-else
                      @click="changeStatus(user.userID, 'NORMAL')" 
                      class="text-green-600 hover:text-green-900"
                    >
                      解封
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
         分页 
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredUsers.length) }}</span> 条，
              共 <span class="font-medium">{{ filteredUsers.length }}</span> 条
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)" 
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button 
              @click="currentPage = Math.min(Math.ceil(filteredUsers.length / pageSize), currentPage + 1)" 
              :disabled="currentPage >= Math.ceil(filteredUsers.length / pageSize)"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

     用户详情模态框 
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">用户详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6" v-if="selectedUser">
          <div class="space-y-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-24 w-24">
                <img class="h-24 w-24 rounded-full" :src="selectedUser.profilePicture || '/placeholder.svg?height=96&width=96'" alt="">
              </div>
              <div class="ml-6">
                <h2 class="text-xl font-bold text-gray-900">{{ selectedUser.username }}</h2>
                <div class="flex items-center mt-1">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full mr-2',
                      selectedUser.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ selectedUser.role === 'ROLE_ADMIN' ? '管理员' : '普通用户' }}
                  </span>
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      selectedUser.status === 'NORMAL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ getStatusText(selectedUser.status) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="text-sm">
                  <span class="text-gray-500">用户ID:</span>
                  <span class="ml-2 text-gray-900">{{ selectedUser.userID }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-500">注册时间:</span>
                  <span class="ml-2 text-gray-900">{{ formatDate(selectedUser.initDate) }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-sm">
                  <span class="text-gray-500">邮箱:</span>
                  <span class="ml-2 text-gray-900">{{ selectedUser.email }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-500">手机号:</span>
                  <span class="ml-2 text-gray-900">{{ formatPhone(selectedUser.phoneNumber) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                v-if="selectedUser.status === 'NORMAL'"
                @click="changeStatus(selectedUser.userID, 'BANNED'); showModal = false" 
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                封禁用户
              </button>
              <button 
                v-else
                @click="changeStatus(selectedUser.userID, 'NORMAL'); showModal = false" 
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                解除封禁
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      filters: {
        search: '',
        status: ''
      },
      sorting: {
        field: 'initDate',
        order: 'desc'
      },
      currentPage: 1,
      pageSize: 10,
      users: [],
      showModal: false,
      selectedUser: null
    }
  },
  computed: {
    filteredUsers() {
      let result = [...this.users]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(user => 
          user.userID.toString().includes(search) || 
          user.username.toLowerCase().includes(search) ||
          (user.email && user.email.toLowerCase().includes(search))
        )
      }
      
      if (this.filters.status) {
        result = result.filter(user => user.status === this.filters.status)
      }
      
      result.sort((a, b) => {
        let comparison = 0
        if (this.sorting.field === 'userID') {
          comparison = a.userID - b.userID
        } else if (this.sorting.field === 'username') {
          comparison = a.username.localeCompare(b.username)
        } else if (this.sorting.field === 'initDate') {
          comparison = new Date(a.initDate) - new Date(b.initDate)
        }
        return this.sorting.order === 'asc' ? comparison : -comparison
      })
      
      return result
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      // 模拟数据加载
      this.users = Array.from({ length: 30 }, (_, i) => ({
        userID: i + 1,
        username: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        phoneNumber: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        initDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        status: ['NORMAL', 'BANNED'][Math.floor(Math.random() * 2)],
        role: i === 0 ? 'ROLE_ADMIN' : 'ROLE_USER',
        profilePicture: null
      }))
    },
    async changeStatus(userId, status) {
      const user = this.users.find(u => u.userID === userId)
      if (user) {
        user.status = status
      }
      this.showToast('success', '操作成功', `用户状态已更改为${this.getStatusText(status)}`)
    },
    viewUser(user) {
      this.selectedUser = { ...user }
      this.showModal = true
    },
    getStatusText(status) {
      const map = { 'NORMAL': '正常', 'BANNED': '已封禁' }
      return map[status] || '未知'
    },
    formatDate(date) {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    formatPhone(phone) {
      if (!phone) return ''
      const phoneStr = phone.toString()
      return phoneStr.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    },
    showToast(type, title, message) {
      console.log(`${type}: ${title} - ${message}`)
    }
  }
}
</script>
