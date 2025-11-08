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
          <div class="flex items-center space-x-2"  @click="$router.push('/profile')">
            <img :src="user.avatarUrl ? user.avatarUrl : '/placeholder.svg?height=32&width=32'" alt="用户头像" class="w-8 h-8 rounded-full">
            <span class="text-gray-700">{{ user.username ? user.username : '用户' }}</span>
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
              <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>

              <div class="flex items-center space-x-3 mb-4">
                <img :src="post.publisher?.avatarUrl || '/placeholder.svg?height=32&width=32'" alt="作者头像" class="w-12 h-12 rounded-full">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ post.publisher?.username || '未知用户' }}</h3>
                  <p class="text-sm text-gray-500">{{ post.createTime }}</p>
                </div>
              </div>
              
              <!-- 增加帖子标识 -->
              <div class="flex gap-2 mb-4">
                <span v-if="post.isHot" class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">热门</span>
                <span v-if="post.isEssence" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">精华</span>
                <span v-if="post.isTop" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">置顶</span>
              </div>
              
              <div class="prose max-w-none mb-6">
                <p  class="mb-4 text-gray-700 leading-relaxed">
                  {{ post.content }}
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
              <h3 class="text-lg font-semibold text-gray-900 mb-4">评论 ({{ totalComments }})</h3>

              <!-- 评论列表 增加高度和优化布局，支持更大的评论区域，每个评论高度约250px -->
              <div class="space-y-4 mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div v-if="comments.length === 0" class="text-center py-12 text-gray-500">
                  <p>暂无评论</p>
                </div>
                <div v-for="comment in comments" :key="comment.follower.userId" class="bg-white rounded-lg p-4 border border-gray-200 min-h-[240px] flex flex-col justify-between">
                  <!-- 评论者信息 -->
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <img :src="comment.follower?.avatarUrl || '/placeholder.svg?height=40&width=40'" alt="评论者头像" class="w-10 h-10 rounded-full">
                        <div>
                          <span class="font-medium text-gray-900">{{ comment.follower.username }}</span>
                          <span class="text-sm text-gray-500 ml-2">{{ comment.createTime }}</span>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-700 leading-relaxed">{{ comment.content }}</p>
                  </div>

                  <!-- 新增点赞和删除按钮，放在评论右下方 -->
                  <div class="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      :class="[
                        'flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors',
                        comment.isLiked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      ]"
                      @click="toggleCommentLike(comment)"
                      title="点赞"
                    >
                      <svg class="w-4 h-4" :fill="comment.isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{{ comment.likeCount || 0 }}</span>
                    </button>

                    <!-- 删除按钮仅管理员可见 -->
                    <button 
                      v-if="user.isAdmin"
                      @click="deleteComment(comment)"
                      class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      title="删除评论"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 新增评论分页控制 -->
              <div class="flex items-center justify-center gap-2 mb-6 py-4">
                <button 
                  @click="goToCommentPage(1)" 
                  :disabled="currentCommentPage === 1 || loadingComments"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  首页
                </button>
                <button 
                  @click="goToCommentPage(currentCommentPage - 1)" 
                  :disabled="currentCommentPage === 1 || loadingComments"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span class="px-3 py-1.5 text-sm text-gray-700">
                  第 {{ currentCommentPage }} / {{ totalCommentPages }} 页
                </span>
                <button 
                  @click="goToCommentPage(currentCommentPage + 1)" 
                  :disabled="currentCommentPage >= totalCommentPages || loadingComments"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
                <button 
                  @click="goToCommentPage(totalCommentPages)" 
                  :disabled="currentCommentPage >= totalCommentPages || loadingComments"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  末页
                </button>
              </div>

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

            </div>
          </div>
        </main>

        <!-- 右侧栏 -->
        <aside class="w-80">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div class="text-center mb-4">
              <div @click="$router.push(`/profile/${post.publisher.userId}`)" class="mb-4" >
                <img :src="post.publisher?.avatarUrl || '/placeholder.svg?height=64&width=64'" alt="作者头像" class="w-16 h-16 rounded-full mx-auto mb-3">
                <h3 class="font-semibold text-gray-900">{{ post.publisher?.username || '未知用户'}}</h3>
                <p class="text-sm text-gray-500 mb-2">信用分：{{ post.publisher?.creditScore || '未知' }}</p>
              </div>
              <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium">
                关注
              </button>
            </div>
            
            <div v-if="user.isAdmin" class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-3">管理员操作</h4>
              <div class="space-y-2">
                <button @click="setTopPost" class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">{{ post.isTop ? '取消置顶' : '置顶帖子' }}</button>
                <button @click="setEssentialPost" class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">{{ post.isEssence ? '取消精华' : '加精华' }}</button> 
                <button @click="blockPost" class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">{{ post.status === PostStatus.NORMAL ? '封禁帖子' : '取消封禁' }}</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getPostDetail, likePost, publishPostFollow, queryPostFollowList, setPostEssenceOrTop, updatePostFollowStatus, updatePostStatus } from '@/api/post'
import { PostDetail, PostLikeParams, PostFollowPublishParams, PostStatusUpdateParams, PostFollowStatusUpdateParams, PostFollowDetail, PostFollowQueryParams, PostEssenceTopParams, PostFollowStatus, PostStatus } from '@/types/post'
import { LoginUserSimple } from '@/types/user';
import { useUserStore } from '@/stores/user';

export default {
  name: 'PostDetail',
  data() {
    return {
      user: {} as LoginUserSimple,
      newComment: '',
      post:  {} as PostDetail,
      comments: [] as PostFollowDetail[],
      PostStatus,
      currentCommentPage: 1,
      commentPageSize: 10,
      totalComments: 0,
      loadingComments: false
    }
  },
  computed: {
    totalCommentPages() {
      return Math.ceil(this.totalComments / this.commentPageSize)
    }
  },
   mounted() {
    this.getUserFromStore()
    // 获取路由参数中的帖子ID
    const postId = Number(this.$route.params.id)
    if (postId) {
      this.loadPostDetail(postId)
      this.loadComments(postId)
    }
  },
  methods: {
    async loadPostDetail(postId: number) {
      try {
        const response = await getPostDetail(postId)
        this.post = response
      } catch (error) {
        console.error('加载帖子详情失败:', error)
      }
    },
    async loadComments(postId: number) {
      this.loadingComments = true
      try {
        const params: PostFollowQueryParams = {
          postId: postId,
          status: PostFollowStatus.NORMAL,
          pageNum: this.currentCommentPage,
          pageSize: this.commentPageSize
        }
        const response = await queryPostFollowList(postId, params)
        this.comments = response.list
        this.totalComments = response.total || (response.list && response.list.length) || 0
      } catch (error) {
        console.error('加载评论失败:', error)
      } finally {
        this.loadingComments = false
      }
    },
    async goToCommentPage(page: number) {
      if (page < 1 || page > this.totalCommentPages || this.loadingComments) return
      this.currentCommentPage = page
      const postId = Number(this.$route.params.id)
      if (postId) {
        await this.loadComments(postId)
      }
    },
    async blockPost() {
      if (!this.post) return
      
      try {
        const params: PostStatusUpdateParams = {
          postId: this.post.postId,
          status: this.post.status === PostStatus.NORMAL ? PostStatus.BLOCKED : PostStatus.NORMAL,
          operatorId: this.user.userId
        }
        await updatePostStatus(params)
        this.loadPostDetail(this.post.postId)
      } catch (error) {
        console.error('隐藏帖子失败:', error)
      }
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
    async toggleCommentLike(comment: PostFollowDetail) {
      try {
        // 调用后端API更新评论点赞状态
        // await likePostComment(comment.followId, { isLike: !comment.isLiked })
        comment.isLiked = !comment.isLiked
        comment.likeCount = (comment.likeCount || 0) + (comment.isLiked ? 1 : -1)
      } catch (error) {
        console.error('评论点赞失败:', error)
      }
    },
    async deleteComment(comment: PostFollowDetail) {
      if (!this.user.isAdmin) {
        alert('只有管理员可以删除评论')
        return
      }
      
      try {
        if (confirm('确定要删除这条评论吗？')) {
          // 调用后端API删除评论
          const params: PostFollowStatusUpdateParams = {
            postFollowId: comment.postFollowId,
            targetStatus: PostFollowStatus.BLOCKED,
          }
          await updatePostFollowStatus(
            this.post.postId,
            params
          )
          alert('评论已删除')
          await this.loadComments(this.post.postId)
        }
      } catch (error) {
        console.error('删除评论失败:', error)
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return
      
      const comment : PostFollowPublishParams = {
        postId: this.post.postId,
        content: this.newComment,
      }
      
      try {
        await publishPostFollow(this.post.postId, comment)
        this.newComment = ''
        // 重新加载评论列表
        const postId = Number(this.$route.params.id)
        if (postId) {
          this.loadComments(postId)
        }
      } catch (error) {
        console.error('发表评论失败:', error)
      }
    },
    async setTopPost() {
      if (!this.post) return
      
      try {
        const params: PostEssenceTopParams = {
          postId: this.post.postId,
          isTop: this.post.isTop ? false : true,
          isEssence: this.post.isEssence
        }
        await setPostEssenceOrTop(this.post.postId, params)
        this.loadPostDetail(this.post.postId)
      } catch (error) {
        console.error('置顶帖子失败:', error)
      }
    },
    async setEssentialPost() {
      if (!this.post) return
      
      try {
        const params: PostEssenceTopParams = {
          postId: this.post.postId,
          isTop: this.post.isTop,
          isEssence: this.post.isEssence ? false : true
        }
        await setPostEssenceOrTop(this.post.postId, params)
        this.loadPostDetail(this.post.postId)
      } catch (error) {
        console.error('加精华帖子失败:', error)
      }
    },
    getUserFromStore(){
      const userStore = useUserStore();
      this.user = userStore.userInfo;
    },
    openImageModal(image: string) {
      // 实现图片预览功能
      console.log('打开图片预览:', image)
    }
  }
}
</script>
