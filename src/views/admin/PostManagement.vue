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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="输入标题或ID" 
              @keyup.enter="searchPosts"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部状态</option>
              <option :value="PostStatus.NORMAL">正常</option>
              <option :value="PostStatus.PENDING">待审核</option>
              <option :value="PostStatus.HIDDEN">隐藏</option>
              <option :value="PostStatus.BLOCKED">已封禁</option>
              <option :value="PostStatus.DELETED">已删除</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
            <select v-model="filters.sorting" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="time-desc">时间倒序</option>
              <option value="time-asc">时间正序</option>
              <option value="likes-desc">点赞数倒序</option>
              <option value="comments-desc">评论数倒序</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">每页数量</label>
            <select v-model="pageSize" @change="searchPosts" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option :value="10">10条/页</option>
              <option :value="20">20条/页</option>
              <option :value="50">50条/页</option>
            </select>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="searchPosts" :disabled="loading" class="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
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
      <div v-if="loading && posts.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p class="text-sm text-gray-500">正在加载数据...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && posts.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-sm text-gray-500">暂无数据</p>
        <p class="text-xs text-gray-400 mt-1">请尝试调整筛选条件</p>
      </div>

      <!-- 帖子列表 -->
      <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              <tr v-for="post in posts" :key="post.postId" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ post.postId }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <div class="max-w-xs truncate">{{ post.title }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ post.publisher.username }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-3">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-danger mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      {{ post.likeCount }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
                      </svg>
                      {{ post.commentCount }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ post.createTime }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span 
                    :class="post.status === PostStatus.NORMAL ? 'bg-green-50 text-green-700' : 
                            post.status === PostStatus.HIDDEN ? 'bg-yellow-50 text-yellow-700' : 
                            post.status === PostStatus.PENDING ? 'bg-blue-50 text-blue-700' : 
                            post.status === PostStatus.BLOCKED ? 'bg-purple-50 text-purple-700' :
                            'bg-red-50 text-red-700'"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ statusMap[post.status] }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="viewPost(post)" class="text-primary hover:text-blue-700 mr-3">查看</button>
                  <button @click="toggleStatus(post)" class="text-warning hover:text-yellow-600 mr-3">
                    {{ post.status === PostStatus.NORMAL ? '封禁' : '恢复' }}
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
            <span>作者: {{ selectedPost.publisher.username }}</span>
            <span class="mx-2">•</span>
            <span>{{ selectedPost.createTime }}</span>
          </div>
          <p class="text-sm text-gray-700 mb-4 leading-relaxed">{{ selectedPost.summary }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
            <span class="flex items-center">
              <svg class="w-4 h-4 text-danger mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
              </svg>
              {{ selectedPost.likeCount }} 点赞
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
              </svg>
              {{ selectedPost.commentCount }} 评论
            </span>
          </div>
          <div class="flex justify-end space-x-3 mt-4">
            <button @click="toggleStatus(selectedPost); showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {{ selectedPost.status === PostStatus.NORMAL ? '封禁帖子' : '恢复帖子' }}
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

<script lang="ts">
import { queryPostList, queryPostCount, updatePostStatus } from '@/api/post';
import { PostStatus, PostSortField, PostQueryParams, PostListItem } from '@/types/post';
import { SortDirection } from '@/types/common';

export default {
  data() {
    return {
      filters: {
        search: '',
        status: '',
        sorting: 'time-desc'
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      showModal: false,
      selectedPost: {} as PostListItem,
      posts: [] as PostListItem[],
      // 显示声明可访问的枚举
      PostStatus,
      // 新增枚举映射用于模板显示
      statusMap: {
        [PostStatus.DRAFT]: '草稿',
        [PostStatus.NORMAL]: '正常',
        [PostStatus.HIDDEN]: '隐藏',
        [PostStatus.PENDING]: '待审核',
        [PostStatus.BLOCKED]: '已封禁',
        [PostStatus.DELETED]: '已删除'
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    }
  },
  mounted() {
    this.searchPosts()
  },
  methods: {
    async searchPosts() {
      this.loading = true
      this.currentPage = 1
      await this.fetchPosts()
    },
    async fetchPosts() {
      try {
        this.loading = true;
        
        // 构建符合DTO规范的查询参数
        const queryParams: PostQueryParams = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.filters.search || undefined,
          status: this.filters.status ? (this.filters.status.toUpperCase() as PostStatus) : undefined,
          // 处理排序参数映射
          sortField: this.getSortField(),
          sortDir: this.getSortDirection()
        };

        // 并行请求列表和总数
        const listRes = await queryPostList(queryParams);
        const countRes = await queryPostCount(queryParams);

        this.posts = listRes.list;
        this.totalCount = countRes;
        
      } catch (error) {
        console.error('获取数据失败:', error)
        alert('获取数据失败，请重试')
      } finally {
        this.loading = false
      }
    },
    // 排序字段映射
    getSortField(): PostSortField | undefined {
      switch (this.filters.sorting) {
        case 'time-desc':
        case 'time-asc':
          return PostSortField.CREATE_TIME;
        // case 'likes-desc':
        //   return PostSortField.LIKE_COUNT;
        case 'comments-desc':
          return PostSortField.COMMENT_COUNT;
        default:
          return undefined;
      }
    },

    // 排序方向映射
    getSortDirection(): SortDirection | undefined {
      return this.filters.sorting.endsWith('desc') 
        ? SortDirection.DESC 
        : SortDirection.ASC;
    },
    async goToPage(page: number) {
      if (page < 1 || page > this.totalPages || this.loading) return
      this.currentPage = page
      await this.fetchPosts()
    },
    resetFilters() {
      this.filters = { search: '', status: '', sorting: 'time-desc' }
      this.searchPosts()
    },
    goBack() {
      alert('返回管理面板')
    },
    viewPost(post: PostListItem) {
      this.selectedPost = post
      this.showModal = true
    },
    async toggleStatus(post: PostListItem) {
      try {
        const targetStatus = post.status === PostStatus.NORMAL 
          ? PostStatus.BLOCKED 
          : PostStatus.NORMAL;

        // 调用状态更新API（需替换实际operatorId）
        await updatePostStatus({
          postId: post.postId,
          targetStatus,
          operatorId: 1 // 当前管理员ID，需从登录信息获取
        });

        // 本地更新状态
        if (this.selectedPost?.postId === post.postId) {
          this.selectedPost.status = targetStatus;
        }
        post.status = targetStatus;
        alert(`帖子 ${post.postId} 状态已更新`);
      } catch (error) {
        console.error('更新状态失败:', error);
        alert('更新状态失败，请重试');
      }
    },
    async deletePost(post: PostListItem) {
      if (confirm(`确定删除帖子 "${post.title}" 吗？`)) {
        // 调用API删除
        post.status = PostStatus.DELETED
        alert(`帖子 ${post.postId} 已删除`)
        await this.fetchPosts()
      }
    }
  }
}
</script>

<style scoped>
.text-primary { color: #1E90FF; }
.text-danger { color: #FF6B6B; }
.text-warning { color: #F59E0B; }
.bg-primary { background-color: #1E90FF; }
.bg-danger { background-color: #FF6B6B; }
.focus\:ring-primary:focus { --tw-ring-color: #1E90FF; }
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>