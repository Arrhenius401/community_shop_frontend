<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button @click="$router.go(-1)" class="mr-4 p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-blue-600">帖子详情</h1>
          </div>
          <div class="flex items-center space-x-2">
            <img src="/placeholder.svg?height=32&width=32" alt="用户头像" class="w-8 h-8 rounded-full">
            <span class="text-gray-700">用户名</span>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- 主内容区 -->
        <main class="flex-1">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- 帖子内容 -->
            <div class="p-6 border-b">
              <div class="flex items-center space-x-3 mb-4">
                <img :src="post.publisher.avatarUrl || '/placeholder.svg?height=32&width=32'" alt="作者头像" class="w-12 h-12 rounded-full">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ post.publisher.username }}</h3>
                  <p class="text-sm text-gray-500">{{ post.createTime }}</p>
                </div>
              </div>
              
              <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
              
              <!-- 增加帖子标识 -->
              <div class="flex gap-2 mb-4">
                <span v-if="post.isHot" class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">热门</span>
                <span v-if="post.isEssence" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">精华</span>
                <span v-if="post.isTop" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">置顶</span>
              </div>
              
              <div class="prose max-w-none mb-6">
                <p v-for="(paragraph, index) in post.content" :key="index" class="mb-4 text-gray-700 leading-relaxed">
                  {{ paragraph }}
                </p>
              </div>

              <!-- 图片展示 -->
              <!-- <div v-if="post.images.length > 0" class="grid grid-cols-3 gap-4 mb-6">
                <img 
                  v-for="(image, index) in post.images" 
                  :key="index"
                  :src="image" 
                  alt="帖子图片"
                  class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                  @click="openImageModal(image)"
                >
              </div> -->
            </div>

            <!-- 互动区 -->
            <div class="p-6 border-b">
              <div class="flex items-center space-x-6">
                <button 
                  :class="[
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                    post.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  ]"
                  @click="toggleLike"
                >
                  <svg class="w-5 h-5" :fill="post.isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span>{{ post.isLiked ? '已点赞' : '点赞' }} ({{ post.likeCount }})</span>
                </button>

                <!-- 收藏按钮 -->
                <!-- <button 
                  :class="[
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                    post.isCollected ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  ]"
                  @click="toggleCollect"
                >
                  <svg class="w-5 h-5" :fill="post.isCollected ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  <span>{{ post.isCollected ? '已收藏' : '收藏' }}</span>
                </button> -->
              </div>
            </div>

            <!-- 评论区 -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">评论 ({{ comments.length }})</h3>
              
              <!-- 发表评论 -->
              <div class="mb-6">
                <textarea 
                  v-model="newComment"
                  placeholder="写下你的评论..."
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="submitComment"
                    :disabled="!newComment.trim()"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发表评论
                  </button>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="space-y-4">
                <div v-for="comment in comments" :key="comment.id" class="flex space-x-3">
                  <img :src="comment.author.avatar" alt="评论者头像" class="w-8 h-8 rounded-full">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="font-medium text-gray-900">{{ comment.author.name }}</span>
                      <span class="text-sm text-gray-500">{{ comment.time }}</span>
                    </div>
                    <p class="text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 右侧栏 -->
        <aside class="w-80">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div class="text-center mb-4">
              <img :src="post.publisher.avatarUrl || '/placeholder.svg?height=64&width=64'" alt="作者头像" class="w-16 h-16 rounded-full mx-auto mb-3">
              <h3 class="font-semibold text-gray-900">{{ post.publisher.username }}</h3>
              <p class="text-sm text-gray-500 mb-2">信用分：{{ post.publisher.creditScore }}</p>
              <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium">
                关注
              </button>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">吧务操作</h4>
              <div class="space-y-2">
                <button class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">置顶帖子</button>
                <button class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">加精华</button>
                <button class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">删除帖子</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getPostDetail, likePost, publishPostFollow } from '@/api/post'
import type { PostDetail, PostLikeParams, PostFollowPublishParams } from '@/types/post'

export default {
  name: 'PostDetail',
  data() {
    return {
      newComment: '',
      post:  {} as PostDetail,
      comments: [] as any[],
    }
  },
   created() {
    // 获取路由参数中的帖子ID
    const postId = Number(this.$route.params.id)
    if (postId) {
      this.loadPostDetail(postId)
      this.loadComments(postId)
    }
  },
  methods: {
    // 收藏帖子功能
    // toggleCollect() {
    //   this.post.isCollected = !this.post.isCollected
    // },
    async loadPostDetail(postId: number) {
      try {
        const response = await getPostDetail(postId)
        this.post = response
      } catch (error) {
        console.error('加载帖子详情失败:', error)
      }
    },
    
    async loadComments(postId: number) {
      // 实际项目中应调用queryPostFollowList API
      console.log('加载评论:', postId)
      // 模拟数据保持不变
    },
    async toggleLike() {
      if (!this.post) return
      
      const params: PostLikeParams = {
        postId: this.post.postId,
        userId: 1,
        isLike: !this.post.isLiked
      }
      
      try {
        await likePost(this.post.postId, params)
        this.post.isLiked = !this.post.isLiked
        this.post.likeCount += this.post.isLiked ? 1 : -1
      } catch (error) {
        console.error('点赞操作失败:', error)
      }
    },
    submitComment() {
      if (!this.newComment.trim()) return
      
      const comment : PostFollowPublishParams = {
        postId: this.post.postId,
        content: this.newComment,
      }
      
      try {
        publishPostFollow(this.post.postId, comment)
        this.comments.unshift(comment)
        this.newComment = ''
      } catch (error) {
        console.error('发表评论失败:', error)
      }
    },
    openImageModal(image: string) {
      // 实现图片预览功能
      console.log('打开图片预览:', image)
    }
  }
}
</script>