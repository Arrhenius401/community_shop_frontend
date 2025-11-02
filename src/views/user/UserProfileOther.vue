<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="text-sm font-medium">返回</span>
          </button>
          <h1 class="text-xl font-bold text-blue-600">用户资料</h1>

          <div class="flex items-center space-x-2 cursor-pointer" @click="$router.push('/profile')">
            <img :src="localUser.avatarUrl ? localUser.avatarUrl : '/placeholder.svg?height=96&width=96'" alt="用户头像" class="w-8 h-8 rounded-full">
            <span class="text-gray-700">{{ localUser.username ? localUser.username : '用户' }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-start space-x-6">
          <!-- 用户头像 -->
          <div class="flex-shrink-0">
            <img :src="user.avatarUrl || '/placeholder.svg?height=96&width=96'" :alt="user.username" class="w-24 h-24 rounded-full border-4 border-gray-100">
          </div>
          
          <!-- 用户基本信息 -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-bold text-gray-900">{{ user.username }}</h2>
              <div class="flex items-center space-x-2">
                <button @click="toggleFollow" :class="isFollowed ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'" class="px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                  {{ isFollowed ? '已关注' : '关注' }}
                </button>
                <button @click="sendMessage" class="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                  私信
                </button>
              </div>
            </div>
            
            <!-- 个人简介 -->
            <p class="text-gray-600 mb-4">{{ user.bio || '暂无个人简介' }}</p>
            
            <!-- 用户信息 -->
            <div class="flex items-center space-x-6 mb-4">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-sm text-gray-600">{{ user.gender === 'MALE' ? '男' : user.gender === 'FEMALE' ? '女' : '保密' }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm text-gray-600">注册于 {{ formatDate(user.createTime) }}</span>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="flex items-center space-x-6 text-sm text-gray-500 pb-4 border-b border-gray-200">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>{{ user.postCount || 0 }} 篇帖子</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h-2m2 0a8 8 0 11-16 0 8 8 0 0116 0zM9 9h.01M15 15H9"></path>
                </svg>
                <span>信用分：{{ user.creditScore || 0 }}</span>
              </div>
            </div>

            <!-- 信用分提示 -->
            <div v-if="user.creditScore < 80" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center space-x-2 text-yellow-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="text-sm">该用户信用分不足</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户帖子 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">用户帖子</h3>
        </div>
        
        <!-- 帖子列表 -->
        <div v-if="userPosts.length > 0" class="divide-y divide-gray-200">
          <div v-for="post in userPosts" :key="post.postId" class="p-6 hover:bg-gray-50 transition-colors cursor-pointer" @click="viewPost(post)">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600">{{ post.title }}</h4>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ post.summary }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ formatDate(post.createTime) }}</span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>{{ post.likeCount || 0 }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    <span>{{ post.commentCount || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-sm text-gray-500">该用户暂无发布帖子</p>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              首页
            </button>
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <span class="px-3 py-1.5 text-sm text-gray-700">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
            </button>
            <button @click="currentPage = totalPages" :disabled="currentPage >= totalPages" class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              末页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 私信模态框 -->
    <div v-if="showMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showMessageModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">发送私信给 {{ user.username }}</h3>
          <button @click="showMessageModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <textarea v-model="messageContent" placeholder="输入您的私信内容..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" rows="4"></textarea>
          <div class="flex justify-end space-x-3 mt-4">
            <button @click="showMessageModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
            <button @click="sendPrivateMessage" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getUserDetail } from '@/api/user';
import { queryPostList, queryPostCount } from '@/api/post';
import { PostListItem, PostStatus } from '@/types/post';
import { LoginUserSimple, UserDetail } from '@/types/user';
import { useUserStore } from '@/stores/user';

export default {
  name: 'OtherUserProfile',
  data() {
    return {
      user: {} as UserDetail,
      localUser: {} as LoginUserSimple,
      userPosts: [] as PostListItem[],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      isFollowed: false,
      showMessageModal: false,
      messageContent: ''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    }
  },
  created() {
    // 获取路由参数中的用户ID
    const userId = Number(this.$route.params.id)
    this.loadUserProfile(userId)
    this.loadUserPosts(userId)
    this.getUserFromStore()
  },
  methods: {
    async loadUserProfile(userId: number) {
      try {
        // 调用API获取用户信息
        this.user = await getUserDetail(userId)
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 编造一个空用户对象以防止页面崩溃
        this.user.username = '未知用户'
        this.user.bio = '该用户暂无介绍'
      }
    },
    async loadUserPosts(userId: number) {
      try {
        // 调用API获取用户帖子
        const postList = await queryPostList({
          userId: userId,
          status: PostStatus.NORMAL,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })

        this.userPosts = postList.list
        this.totalCount = await queryPostCount({ 
          userId: userId,
          status: PostStatus.NORMAL
        })
      } catch (error) {
        console.error('获取用户帖子失败:', error)
        this.userPosts = []
      }
    },
    getUserFromStore(){
      const userStore = useUserStore();
      this.localUser = userStore.userInfo;
    },
    formatDate(dateString: string) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },
    toggleFollow() {
      this.isFollowed = !this.isFollowed
      // 调用API进行关注/取消关注
      // await fetch(`/api/users/${this.user.userId}/follow`, { method: 'POST' })
    },
    sendMessage() {
      this.showMessageModal = true
      this.messageContent = ''
    },
    async sendPrivateMessage() {
      if (!this.messageContent.trim()) {
        alert('请输入私信内容')
        return
      }
      
      try {
        // 调用API发送私信
        // await fetch('/api/messages', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     recipientId: this.user.userId,
        //     content: this.messageContent
        //   })
        // })
        
        alert('私信已发送')
        this.showMessageModal = false
        this.messageContent = ''
      } catch (error) {
        console.error('发送私信失败:', error)
      }
    },
    viewPost(post: any) {
      // 跳转到帖子详情页
      // this.$router.push(`/post/${post.postId}`)
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
