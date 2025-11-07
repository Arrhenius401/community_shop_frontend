<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold text-blue-600">个人中心</h1>
          <button @click="$router.push('/')" class="text-gray-600 hover:text-gray-900">
            返回首页
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 顶部卡片 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-start space-x-6">
          <div class="relative">
            <img :src="user.avatarUrl ? user.avatarUrl : '/placeholder.svg?height=96&width=96'" alt="用户头像" class="w-24 h-24 rounded-full">
            <button class="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex-1">

            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-bold text-gray-900">{{ user.username }}</h2>
              <!-- 设置按钮添加点击事件打开编辑弹窗 -->
              <button @click="showEditModal = true" class="p-2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            
            <p class="text-gray-600 mb-4">{{ user.bio || '暂无个人简介' }}</p>
            
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{{ user.gender === Gender.MALE ? '男' : user.gender === Gender.FEMALE ? '女' : '保密' }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-6 text-sm text-gray-500">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>{{ myPosts.length }} 篇帖子</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>信用分：{{ user.creditScore }}</span>
              </div>
              <button class="text-blue-600 hover:text-blue-700">
                交易记录
              </button>
            </div>
            
            <div v-if="user.creditScore < 80" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center space-x-2 text-yellow-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="text-sm">信用分不足，需提升信用后可发布商品</span>
              </div>
            </div>

            <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>注册时间: {{ user.createTime }}</span>
              </div>

          </div>
        </div>
      </div>

      <!-- 功能模块 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 我的帖子 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">我的帖子</h3>
                <div class="flex space-x-2">
                  <button 
                    v-for="tab in postTabs" 
                    :key="tab.key"
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                      activePostTab === tab.key 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                    @click="activePostTab = tab.key"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="post in myPosts" :key="post.postId" class="border border-gray-200 rounded-lg p-4 relative min-h-32">
                  <!-- 右上角状态标识 -->
                  <span 
                      :class="post.status === PostStatus.NORMAL ? 'bg-green-50 text-green-700' : 
                              post.status === PostStatus.HIDDEN ? 'bg-yellow-50 text-yellow-700' : 
                              post.status === PostStatus.PENDING ? 'bg-blue-50 text-blue-700' : 
                              post.status === PostStatus.BLOCKED ? 'bg-purple-50 text-purple-700' :
                              'bg-red-50 text-red-700'"
                      class="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ statusMap[post.status] }}
                  </span>
                  
                  <!-- 中间内容区域 -->
                  <div class="flex-1 pr-32">
                    <h4 class="font-medium text-gray-900 mb-2">{{ post.title }}</h4>
                    <p class="text-gray-600 text-sm mb-2">{{ post.summary }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ post.createTime }}</span>
                      <span>{{ post.likeCount }} 点赞</span>
                      <span>{{ post.commentCount }} 评论</span>
                    </div>
                  </div>

                  <!-- 右下角操作按钮 -->
                  <div class="absolute bottom-4 right-4 flex space-x-2">
                    <button class="text-green-600 hover:text-green-700 text-sm disabled:text-gray-400" @click="$router.push(`/post/${post.postId}`)">查看</button>
                    <button class="text-blue-600 hover:text-blue-700 text-sm disabled:text-gray-400" @click="openEditPostModal(post.postId)" :disabled="post.status !== PostStatus.NORMAL">编辑</button>
                    <button class="text-red-600 hover:text-red-700 text-sm disabled:text-gray-400" @click="deletePost(post.postId)" :disabled="post.status !== PostStatus.NORMAL">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 我的收藏 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">我的收藏</h3>
            <div class="space-y-3">
              <div v-for="category in collectCategories" :key="category.name" class="flex items-center justify-between">
                <span class="text-gray-700">{{ category.name }}</span>
                <span class="text-sm text-gray-500">{{ category.count }}</span>
              </div>
            </div>
            <button class="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm">
              管理收藏
            </button>
          </div>

          <!-- 安全中心 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">安全中心</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">二次验证</span>
                <button class="text-blue-600 hover:text-blue-700 text-sm">设置</button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">登录日志</span>
                <button class="text-blue-600 hover:text-blue-700 text-sm">查看</button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">异地登录提醒</span>
                <div class="flex items-center">
                  <input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>

          <!-- 控制台 -->
          <!-- 仅当用户拥有管理员权限时可见 -->
          <div v-if="isAdmin" class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">管理权限</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">控制台</span>
                <button @click="$router.push('/admin')" class="text-blue-600 hover:text-blue-700 text-sm">进入</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 个人资料编辑弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showEditModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">编辑个人资料</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitEditProfile" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
            <input 
              v-model="editForm.username" 
              type="text" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入用户名"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">个人简介</label>
            <textarea 
              v-model="editForm.bio" 
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入个人简介"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">性别</label>
            <select 
              v-model="editForm.gender"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="Gender.UNKNOWN">保密</option>
              <option :value="Gender.MALE">男</option>
              <option :value="Gender.FEMALE">女</option>
            </select>
          </div>

          <div class="flex space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="showEditModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? '保存中...' : '保存修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 添加帖子编辑弹窗 -->
    <div v-if="showEditPostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showEditPostModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">编辑帖子</h3>
          <button @click="showEditPostModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitEditPost" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">标题</label>
            <input 
              v-model="editPostForm.title" 
              type="text" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入帖子标题"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">内容</label>
            <textarea 
              v-model="editPostForm.content" 
              rows="6"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入帖子内容"
            ></textarea>
          </div>

          <div class="flex space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="showEditPostModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="submittingPost"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="submittingPost" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submittingPost ? '保存中...' : '保存修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user';
import { getUserProfile, updateUserProfile, checkIsAdmin } from '../../api/user';
import { getPostDetail, queryPrivatePostList, updatePost, updatePostStatus } from '@/api/post';
import { UserDetail, LoginUserSimple, UserProfileUpdateParams, Gender } from '../../types/user';
import { PostQueryParams, PostUpdateParams, PostStatusUpdateParams, PostStatus, PostDetail, PostListItem } from '../../types/post';

export default {
  name: 'UserProfile',
  data() {
    return {
      Gender,
      isAdmin: false,
      activePostTab: 'all',
      user: {} as UserDetail,
      userStore: useUserStore(),
      /** 编辑用户个人信息表单数据 */
      showEditModal: false,
      submitting: false,
      editForm: {
        username: '',
        bio: '',
        gender: Gender.UNKNOWN as Gender,
      },
      /** 编辑帖子表单数据 */
      showEditPostModal: false,
      submittingPost: false,
      editingPostId: null as number | null,
      editPostForm: {
        title: '',
        content: ''
      },
      postTabs: [
        { key: 'all', label: '全部' },
        { key: 'published', label: '已发布' },
        { key: 'draft', label: '草稿' }
      ],
      myPosts: [] as PostListItem[],
      collectCategories: [
        { name: '待阅读', count: 12 },
        { name: '兴趣话题', count: 8 },
        { name: '技术文章', count: 15 }
      ],
      statusMap: {
        [PostStatus.DRAFT]: '草稿',
        [PostStatus.NORMAL]: '正常',
        [PostStatus.HIDDEN]: '隐藏',
        [PostStatus.PENDING]: '待审核',
        [PostStatus.BLOCKED]: '已封禁',
        [PostStatus.DELETED]: '已删除'
      },
      PostStatus
    }
  },
  mounted() {
    this.checkAdmin_profile()
    this.getUserFromToken()
    this.getMyPost()
  },
  methods: {
    async checkAdmin_profile(){
      try{
        this.isAdmin = await checkIsAdmin()
        console.log("管理身份认证状态: ", this.isAdmin)
      }catch(error){
        console.log("管理身份认证失败")
      }
    },
    async getUserFromToken(){
      this.user = await getUserProfile()
      this.initEditForm()
    },
    async getMyPost(){
      try{
        const userId = this.userStore.userInfo?.userId || null;
        const postQuery: PostQueryParams = {
          pageNum: 1,
          pageSize: 10,
          userId: userId || undefined
        };
        this.myPosts = (await queryPrivatePostList(postQuery)).list
      }catch(error){
        console.log("获取本机用户创建帖子的请求失败: ", error)
      }
    },
    async deletePost(postId: number) {
      try {
        if(confirm('确定要删除这条评论吗？')){
          const params : PostStatusUpdateParams = {
            postId: postId,
            status: PostStatus.DELETED,
            operatorId: this.user.userId
          };
          await updatePostStatus(params);
          this.getMyPost();
          this.$emit('showToast', {
            type: 'success',
            title: '删除成功',
            message: '帖子已删除'
          });
        }
      } catch (error) {
        console.error('删除帖子失败', error);
      }
    },
    async openEditPostModal(postId: number) {
      try{
        const postDetail: PostDetail = await getPostDetail(postId)
        this.editingPostId = postId
        this.editPostForm = {
          title: postDetail.title,
          content: postDetail.content
        }
        this.showEditPostModal = true
      }catch(error){
        console.log("获取帖子详情请求失败: ", error)
        this.$emit('showToast', {
          type: 'error',
          title: '获取帖子详情失败',
          message: '请稍后重试'
        })
      }
    },

    async submitEditPost() {
      const postId = this.editingPostId
      if(postId == null){
        return
      }
      this.submittingPost = true
      try {
        const params: PostUpdateParams = {
          postId: postId,
          operatorId: this.user.userId,
          title: this.editPostForm.title,
          content: this.editPostForm.content
        }
        
        await updatePost(postId, params)
        this.getMyPost()
        this.showEditPostModal = false

        this.$emit('showToast', {
          type: 'success',
          title: '更新成功',
          message: '帖子已更新'
        })
      } catch (error) {
        console.error('编辑帖子失败', error)
        this.$emit('showToast', {
          type: 'error',
          title: '更新失败',
          message: '帖子更新失败，请重试'
        })
      } finally {
        this.submittingPost = false
      }
    },
    initEditForm() {
      this.editForm = {
        username: this.user.username || '',
        bio: this.user.bio || '',
        gender: this.user.gender || Gender.UNKNOWN
      }
    },
    async submitEditProfile() {
      this.submitting = true
      try {
        const updateParams: UserProfileUpdateParams = {
          username: this.editForm.username,
          bio: this.editForm.bio,
          gender: this.editForm.gender
        };
        
        const updatedUser = await updateUserProfile(updateParams);
        this.user = updatedUser;
        this.showEditModal = false;

        // 更新pinia中userInfo信息
        const userInfo: LoginUserSimple = {
          userId: this.user.userId,
          username: this.user.username,
          avatarUrl: this.user.avatarUrl,
          creditScore: this.user.creditScore,
          isAdmin: this.isAdmin
        }
        this.userStore.updateUserInfo(userInfo)

        this.$emit('showToast', {
          type: 'success',
          title: '更新成功',
          message: '个人资料已更新'
        });
      } catch (error) {
        console.error('资料更新失败', error);
        this.$emit('showToast', {
          type: 'error',
          title: '更新失败',
          message: '个人资料更新失败，请重试'
        });
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>