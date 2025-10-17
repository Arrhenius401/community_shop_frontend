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
          <h1 class="text-2xl font-bold text-gray-900">帖子管理</h1>
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
              placeholder="输入ID或标题搜索" 
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
              <option value="HIDDEN">隐藏</option>
              <option value="DELETED">已删除</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">排序方式</label>
            <div class="flex space-x-2">
              <select 
                v-model="sorting.field" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="postID">ID</option>
                <option value="createTime">创建时间</option>
                <option value="likeCount">点赞数</option>
                <option value="commentCount">评论数</option>
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

       帖子列表 
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">互动</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="post in filteredPosts" :key="post.postID" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ post.postID }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <span v-if="post.isHot" class="mr-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">热门</span>
                    <span class="truncate max-w-xs">{{ post.title }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ post.username }} (ID: {{ post.userID }})
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-3">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      {{ post.likeCount }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
                      </svg>
                      {{ post.commentCount }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(post.createTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      post.status === 'NORMAL' ? 'bg-green-100 text-green-800' : 
                      post.status === 'HIDDEN' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ getStatusText(post.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button @click="viewPost(post)" class="text-blue-600 hover:text-blue-900">查看</button>
                    <button v-if="post.status !== 'NORMAL'" @click="changeStatus(post.postID, 'NORMAL')" class="text-green-600 hover:text-green-900">恢复</button>
                    <button v-if="post.status !== 'HIDDEN'" @click="changeStatus(post.postID, 'HIDDEN')" class="text-yellow-600 hover:text-yellow-900">隐藏</button>
                    <button v-if="post.status !== 'DELETED'" @click="changeStatus(post.postID, 'DELETED')" class="text-red-600 hover:text-red-900">删除</button>
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
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredPosts.length) }}</span> 条，
              共 <span class="font-medium">{{ filteredPosts.length }}</span> 条
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
              @click="currentPage = Math.min(Math.ceil(filteredPosts.length / pageSize), currentPage + 1)" 
              :disabled="currentPage >= Math.ceil(filteredPosts.length / pageSize)"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

     帖子详情模态框 
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">帖子详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6" v-if="selectedPost">
          <div class="space-y-4">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-bold">{{ selectedPost.title }}</h2>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  selectedPost.status === 'NORMAL' ? 'bg-green-100 text-green-800' : 
                  selectedPost.status === 'HIDDEN' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ getStatusText(selectedPost.status) }}
              </span>
            </div>
            
            <div class="flex items-center text-sm text-gray-500">
              <span>ID: {{ selectedPost.postID }}</span>
              <span class="mx-2">•</span>
              <span>作者: {{ selectedPost.username }} (ID: {{ selectedPost.userID }})</span>
              <span class="mx-2">•</span>
              <span>{{ formatDate(selectedPost.createTime) }}</span>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="prose max-w-none" v-html="selectedPost.content"></div>
            </div>
            
            <div class="flex items-center space-x-4 text-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                </svg>
                {{ selectedPost.likeCount }} 点赞
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
                </svg>
                {{ selectedPost.commentCount }} 评论
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                v-if="selectedPost.status !== 'NORMAL'"
                @click="changeStatus(selectedPost.postID, 'NORMAL'); showModal = false" 
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                恢复帖子
              </button>
              <button 
                v-if="selectedPost.status !== 'HIDDEN'"
                @click="changeStatus(selectedPost.postID, 'HIDDEN'); showModal = false" 
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                隐藏帖子
              </button>
              <button 
                v-if="selectedPost.status !== 'DELETED'"
                @click="changeStatus(selectedPost.postID, 'DELETED'); showModal = false" 
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除帖子
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
  name: 'AdminPosts',
  data() {
    return {
      filters: {
        search: '',
        status: ''
      },
      sorting: {
        field: 'createTime',
        order: 'desc'
      },
      currentPage: 1,
      pageSize: 10,
      posts: [],
      showModal: false,
      selectedPost: null
    }
  },
  computed: {
    filteredPosts() {
      let result = [...this.posts]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(post => 
          post.postID.toString().includes(search) || 
          post.title.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.status) {
        result = result.filter(post => post.status === this.filters.status)
      }
      
      result.sort((a, b) => {
        let comparison = 0
        if (this.sorting.field === 'postID') {
          comparison = a.postID - b.postID
        } else if (this.sorting.field === 'createTime') {
          comparison = new Date(a.createTime) - new Date(b.createTime)
        } else if (this.sorting.field === 'likeCount') {
          comparison = a.likeCount - b.likeCount
        } else if (this.sorting.field === 'commentCount') {
          comparison = a.commentCount - b.commentCount
        }
        return this.sorting.order === 'asc' ? comparison : -comparison
      })
      
      return result
    }
  },
  mounted() {
    this.loadPosts()
  },
  methods: {
    async loadPosts() {
      // 模拟数据加载
      this.posts = Array.from({ length: 30 }, (_, i) => ({
        postID: i + 1,
        title: `测试帖子 ${i + 1}`,
        username: `用户${i + 1}`,
        userID: i + 1,
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: ['NORMAL', 'HIDDEN', 'DELETED'][Math.floor(Math.random() * 3)],
        isHot: Math.random() > 0.7,
        content: '这是帖子内容...'
      }))
    },
    async changeStatus(postId, status) {
      const post = this.posts.find(p => p.postID === postId)
      if (post) {
        post.status = status
      }
      this.showToast('success', '操作成功', `帖子状态已更改为${this.getStatusText(status)}`)
    },
    viewPost(post) {
      this.selectedPost = { ...post }
      this.showModal = true
    },
    getStatusText(status) {
      const map = { 'NORMAL': '正常', 'HIDDEN': '隐藏', 'DELETED': '已删除' }
      return map[status] || '未知'
    },
    formatDate(date) {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    showToast(type, title, message) {
      console.log(`${type}: ${title} - ${message}`)
    }
  }
}
</script>
