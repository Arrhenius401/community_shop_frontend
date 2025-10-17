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
          <h1 class="text-xl font-medium text-gray-900">帖子管理</h1>
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
              placeholder="输入标题或ID" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部状态</option>
              <option value="normal">正常</option>
              <option value="hidden">隐藏</option>
              <option value="deleted">已删除</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
            <select v-model="sorting" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="time-desc">时间倒序</option>
              <option value="time-asc">时间正序</option>
              <option value="likes-desc">点赞数倒序</option>
              <option value="comments-desc">评论数倒序</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="resetFilters" class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              重置筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">互动</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ post.id }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <div class="max-w-xs truncate">{{ post.title }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ post.author }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-3">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-danger mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      {{ post.likes }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
                      </svg>
                      {{ post.comments }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ post.time }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="getStatusClass(post.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(post.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="viewPost(post)" class="text-primary hover:text-blue-700 mr-3">查看</button>
                  <button @click="toggleStatus(post)" class="text-warning hover:text-yellow-600 mr-3">
                    {{ post.status === 'normal' ? '隐藏' : '恢复' }}
                  </button>
                  <button @click="deletePost(post)" class="text-danger hover:text-red-700">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - <span class="font-medium">{{ Math.min(currentPage * pageSize, totalPosts) }}</span> 条，共 <span class="font-medium">{{ totalPosts }}</span> 条
          </div>
          <div class="flex space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <button @click="nextPage" :disabled="currentPage * pageSize >= totalPosts" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 详情模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">帖子详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedPost">
          <h2 class="text-xl font-medium text-gray-900 mb-3">{{ selectedPost.title }}</h2>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span>作者: {{ selectedPost.author }}</span>
            <span class="mx-2">•</span>
            <span>{{ selectedPost.time }}</span>
          </div>
          <p class="text-sm text-gray-700 mb-4 leading-relaxed">{{ selectedPost.content }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
            <span class="flex items-center">
              <svg class="w-4 h-4 text-danger mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
              </svg>
              {{ selectedPost.likes }} 点赞
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
              </svg>
              {{ selectedPost.comments }} 评论
            </span>
          </div>
          <div class="flex justify-end space-x-3 mt-4">
            <button @click="toggleStatus(selectedPost); showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {{ selectedPost.status === 'normal' ? '隐藏帖子' : '恢复帖子' }}
            </button>
            <button @click="deletePost(selectedPost); showModal = false" class="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-700">
              删除帖子
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
        status: ''
      },
      sorting: 'time-desc',
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      selectedPost: null,
      posts: [
        { id: 1001, title: '二手iPhone 13转让，9成新', author: '张三', likes: 45, comments: 12, time: '2024-01-15 10:30', status: 'normal', content: '9成新iPhone 13，128GB，蓝色，无划痕，配件齐全，有需要的联系我。' },
        { id: 1002, title: '教材书籍低价出售', author: '李四', likes: 23, comments: 8, time: '2024-01-15 09:20', status: 'normal', content: '大学教材，全新未拆封，低价转让。' },
        { id: 1003, title: '自行车出租，日租10元', author: '王五', likes: 67, comments: 15, time: '2024-01-14 16:45', status: 'normal', content: '山地自行车，日租10元，长租优惠。' },
        { id: 1004, title: '垃圾广告帖', author: '赵六', likes: 2, comments: 1, time: '2024-01-14 14:20', status: 'hidden', content: '违规内容已隐藏。' },
        { id: 1005, title: '寻物启事：丢失钱包一个', author: '孙七', likes: 89, comments: 23, time: '2024-01-14 11:10', status: 'normal', content: '丢失钱包一个，内有身份证和银行卡，如有拾到请联系我，必有重谢！' },
      ]
    }
  },
  computed: {
    filteredPosts() {
      let result = [...this.posts]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(post => 
          post.title.toLowerCase().includes(search) || 
          post.id.toString().includes(search)
        )
      }
      
      if (this.filters.status) {
        result = result.filter(post => post.status === this.filters.status)
      }
      
      result.sort((a, b) => {
        if (this.sorting === 'time-desc') return new Date(b.time) - new Date(a.time)
        if (this.sorting === 'time-asc') return new Date(a.time) - new Date(b.time)
        if (this.sorting === 'likes-desc') return b.likes - a.likes
        if (this.sorting === 'comments-desc') return b.comments - a.comments
        return 0
      })
      
      return result
    },
    totalPosts() {
      return this.filteredPosts.length
    }
  },
  methods: {
    goBack() {
      alert('返回管理面板')
    },
    resetFilters() {
      this.filters = { search: '', status: '' }
      this.sorting = 'time-desc'
    },
    getStatusClass(status) {
      return {
        normal: 'bg-green-50 text-green-700',
        hidden: 'bg-yellow-50 text-yellow-700',
        deleted: 'bg-red-50 text-red-700'
      }[status]
    },
    getStatusText(status) {
      return { normal: '正常', hidden: '隐藏', deleted: '已删除' }[status]
    },
    viewPost(post) {
      this.selectedPost = post
      this.showModal = true
    },
    toggleStatus(post) {
      post.status = post.status === 'normal' ? 'hidden' : 'normal'
      alert(`帖子 ${post.id} 状态已更新`)
    },
    deletePost(post) {
      if (confirm(`确定删除帖子 "${post.title}" 吗？`)) {
        post.status = 'deleted'
        alert('帖子已删除')
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage * this.pageSize < this.totalPosts) this.currentPage++
    }
  }
}
</script>

<style scoped>
.text-primary { color: #1E90FF; }
.text-danger { color: #FF6B6B; }
.text-warning { color: #F59E0B; }
.bg-danger { background-color: #FF6B6B; }
.focus\:ring-primary:focus { --tw-ring-color: #1E90FF; }
</style>