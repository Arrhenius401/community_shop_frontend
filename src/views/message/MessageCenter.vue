<template>
  <div class="min-h-screen bg-gray-50">
     顶部导航 
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <button @click="$router.go(-1)" class="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">消息中心</h1>
            <span v-if="totalUnreadCount > 0" class="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
            </span>
          </div>
          <button 
            @click="markAllAsRead"
            :disabled="totalUnreadCount === 0"
            class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            全部已读
          </button>
        </div>
      </div>
    </div>

     分类标签栏 
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-md mx-auto px-4">
        <div class="flex space-x-1 overflow-x-auto scrollbar-hide">
          <button
            v-for="category in categories"
            :key="category.key"
            @click="selectCategory(category.key)"
            :class="[
              'flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeCategory === category.key
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ category.name }}
            <span v-if="category.unreadCount > 0" class="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {{ category.unreadCount > 99 ? '99+' : category.unreadCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

     消息列表 
    <div class="max-w-md mx-auto">
      <div v-if="loading" class="p-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-lg shadow-sm mb-3 p-4 animate-pulse">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center py-16">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"></path>
        </svg>
        <p class="text-gray-500 text-lg font-medium">暂无消息</p>
        <p class="text-gray-400 text-sm mt-1">您的消息将会显示在这里</p>
      </div>

      <div v-else class="p-4 space-y-3">
        <div
          v-for="message in messages"
          :key="message.msgId"
          @click="viewMessage(message)"
          @touchstart="handleTouchStart($event, message)"
          @touchend="handleTouchEnd"
          class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all duration-200 relative"
          :class="{ 'border-l-4 border-l-blue-500': !message.isRead }"
        >
          <div class="flex items-start space-x-3">
             未读指示器 
            <div v-if="!message.isRead" class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            
             头像 
            <div class="flex-shrink-0">
              <div v-if="message.senderType === 'system'" class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <img v-else :src="message.senderAvatar || '/placeholder.svg?height=40&width=40'" :alt="message.senderName" class="w-10 h-10 rounded-full object-cover">
            </div>

             消息内容 
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-sm font-medium text-gray-900 truncate" :class="{ 'font-semibold': !message.isRead }">
                  {{ message.title }}
                </h3>
                <span class="text-xs text-gray-500 flex-shrink-0 ml-2">{{ formatTime(message.sendTime) }}</span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2 mb-1">{{ message.summary }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ getCategoryName(message.type) }}</span>
                <div v-if="message.type === 'order'" class="flex items-center text-xs text-blue-600">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  订单相关
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       加载更多 
      <div v-if="hasMore && !loading" class="p-4">
        <button 
          @click="loadMore"
          class="w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          加载更多消息
        </button>
      </div>
    </div>

     长按操作菜单 
    <div v-if="showActionMenu" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" @click="hideActionMenu">
      <div class="bg-white rounded-t-2xl w-full max-w-md mx-auto p-4 transform transition-transform" @click.stop>
        <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div class="space-y-2">
          <button 
            v-if="selectedMessage && !selectedMessage.isRead"
            @click="markAsRead(selectedMessage)"
            class="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            标记为已读
          </button>
          <button 
            @click="deleteMessage(selectedMessage)"
            class="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            删除消息
          </button>
        </div>
        <button 
          @click="hideActionMenu"
          class="w-full mt-4 py-3 text-gray-500 border-t border-gray-200"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageCenter',
  data() {
    return {
      loading: false,
      messages: [],
      activeCategory: 'all',
      totalUnreadCount: 0,
      hasMore: true,
      page: 1,
      pageSize: 20,
      
      // 长按相关
      showActionMenu: false,
      selectedMessage: null,
      touchTimer: null,
      
      categories: [
        { key: 'all', name: '全部消息', unreadCount: 0 },
        { key: 'order', name: '订单通知', unreadCount: 0 },
        { key: 'system', name: '系统公告', unreadCount: 0 },
        { key: 'service', name: '售后提醒', unreadCount: 0 }
      ]
    }
  },
  
  mounted() {
    this.loadUnreadCount()
    this.loadMessages()
  },
  
  methods: {
    async loadUnreadCount() {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 模拟数据
        const unreadData = {
          total: 12,
          byType: {
            order: 5,
            system: 3,
            service: 4
          }
        }
        
        this.totalUnreadCount = unreadData.total
        this.categories.forEach(category => {
          if (category.key === 'all') {
            category.unreadCount = unreadData.total
          } else {
            category.unreadCount = unreadData.byType[category.key] || 0
          }
        })
      } catch (error) {
        console.error('获取未读消息数失败:', error)
      }
    },
    
    async loadMessages(reset = false) {
      if (this.loading) return
      
      this.loading = true
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据
        const mockMessages = []
        const startIndex = reset ? 0 : this.messages.length
        
        for (let i = 0; i < this.pageSize; i++) {
          const id = startIndex + i + 1
          const types = ['order', 'system', 'service']
          const type = this.activeCategory === 'all' ? types[Math.floor(Math.random() * types.length)] : this.activeCategory
          
          mockMessages.push({
            msgId: id,
            type: type,
            title: this.generateTitle(type, id),
            summary: this.generateSummary(type, id),
            content: this.generateContent(type, id),
            sendTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            isRead: Math.random() > 0.4,
            senderType: type === 'system' ? 'system' : 'user',
            senderName: type === 'system' ? '系统消息' : `用户${Math.floor(Math.random() * 100)}`,
            senderAvatar: type === 'system' ? null : `/placeholder.svg?height=40&width=40&text=U${id}`,
            orderId: type === 'order' ? `ORD${Date.now()}${id}` : null
          })
        }
        
        if (reset) {
          this.messages = mockMessages
        } else {
          this.messages.push(...mockMessages)
        }
        
        this.hasMore = this.messages.length < 100
      } catch (error) {
        console.error('获取消息列表失败:', error)
        this.showToast('error', '加载失败', '获取消息列表失败，请重试')
      } finally {
        this.loading = false
      }
    },
    
    generateTitle(type, id) {
      switch (type) {
        case 'order':
          return `订单 #${id} 状态更新`
        case 'system':
          return `系统公告 - 重要通知 ${id}`
        case 'service':
          return `售后服务提醒 ${id}`
        default:
          return `消息标题 ${id}`
      }
    },
    
    generateSummary(type, id) {
      switch (type) {
        case 'order':
          return `您的订单已发货，预计3-5个工作日内送达，请注意查收。订单号：ORD${Date.now()}${id}`
        case 'system':
          return `系统将于今晚23:00-01:00进行维护升级，期间可能影响部分功能使用，敬请谅解。`
        case 'service':
          return `您申请的退换货服务已受理，客服将在24小时内与您联系，请保持电话畅通。`
        default:
          return `这是消息 ${id} 的摘要内容，包含了重要的信息概述。`
      }
    },
    
    generateContent(type, id) {
      switch (type) {
        case 'order':
          return `<div class="space-y-4">
            <h3 class="font-semibold">订单状态更新</h3>
            <p>尊敬的用户，您的订单 #${id} 状态已更新：</p>
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-green-800">✅ 商品已发货</p>
              <p class="text-sm text-green-600 mt-1">快递单号：SF123456789${id}</p>
            </div>
            <p>预计送达时间：3-5个工作日</p>
            <p>如有疑问，请联系客服。</p>
          </div>`
        case 'system':
          return `<div class="space-y-4">
            <h3 class="font-semibold">系统维护通知</h3>
            <p>亲爱的用户：</p>
            <p>为了给您提供更好的服务体验，我们将于今晚23:00-01:00进行系统维护升级。</p>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <p class="text-yellow-800">⚠️ 维护期间可能影响的功能：</p>
              <ul class="text-sm text-yellow-700 mt-1 list-disc list-inside">
                <li>订单提交和支付</li>
                <li>消息推送</li>
                <li>部分页面访问</li>
              </ul>
            </div>
            <p>感谢您的理解与支持！</p>
          </div>`
        case 'service':
          return `<div class="space-y-4">
            <h3 class="font-semibold">售后服务进度</h3>
            <p>您好，您申请的售后服务已受理：</p>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-blue-800">📋 服务类型：退换货</p>
              <p class="text-blue-800">🔢 服务单号：SRV${Date.now()}${id}</p>
              <p class="text-blue-800">📅 申请时间：${new Date().toLocaleDateString()}</p>
            </div>
            <p>客服将在24小时内与您联系，请保持电话畅通。</p>
            <p>如需紧急处理，请拨打客服热线：400-123-4567</p>
          </div>`
        default:
          return `<p>这是消息 ${id} 的详细内容。</p>`
      }
    },
    
    selectCategory(category) {
      if (this.activeCategory === category) return
      
      this.activeCategory = category
      this.page = 1
      this.hasMore = true
      this.loadMessages(true)
    },
    
    loadMore() {
      this.page++
      this.loadMessages()
    },
    
    viewMessage(message) {
      // 跳转到消息详情页
      this.$router.push({
        name: 'MessageDetail',
        params: { msgId: message.msgId }
      })
      
      // 如果是未读消息，标记为已读
      if (!message.isRead) {
        this.markAsRead(message, false)
      }
    },
    
    async markAsRead(message, showToast = true) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        message.isRead = true
        this.totalUnreadCount = Math.max(0, this.totalUnreadCount - 1)
        
        // 更新分类未读数
        const category = this.categories.find(c => c.key === message.type)
        if (category) {
          category.unreadCount = Math.max(0, category.unreadCount - 1)
        }
        const allCategory = this.categories.find(c => c.key === 'all')
        if (allCategory) {
          allCategory.unreadCount = this.totalUnreadCount
        }
        
        if (showToast) {
          this.showToast('success', '操作成功', '消息已标记为已读')
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        this.showToast('error', '操作失败', '标记已读失败，请重试')
      } finally {
        this.hideActionMenu()
      }
    },
    
    async markAllAsRead() {
      if (this.totalUnreadCount === 0) return
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 标记所有消息为已读
        this.messages.forEach(message => {
          message.isRead = true
        })
        
        this.totalUnreadCount = 0
        this.categories.forEach(category => {
          category.unreadCount = 0
        })
        
        this.showToast('success', '操作成功', '所有消息已标记为已读')
      } catch (error) {
        console.error('全部标记已读失败:', error)
        this.showToast('error', '操作失败', '标记失败，请重试')
      }
    },
    
    async deleteMessage(message) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 从列表中移除
        const index = this.messages.findIndex(m => m.msgId === message.msgId)
        if (index > -1) {
          this.messages.splice(index, 1)
        }
        
        // 如果是未读消息，更新未读数
        if (!message.isRead) {
          this.totalUnreadCount = Math.max(0, this.totalUnreadCount - 1)
          const category = this.categories.find(c => c.key === message.type)
          if (category) {
            category.unreadCount = Math.max(0, category.unreadCount - 1)
          }
          const allCategory = this.categories.find(c => c.key === 'all')
          if (allCategory) {
            allCategory.unreadCount = this.totalUnreadCount
          }
        }
        
        this.showToast('success', '删除成功', '消息已删除')
      } catch (error) {
        console.error('删除消息失败:', error)
        this.showToast('error', '删除失败', '删除消息失败，请重试')
      } finally {
        this.hideActionMenu()
      }
    },
    
    handleTouchStart(event, message) {
      this.selectedMessage = message
      this.touchTimer = setTimeout(() => {
        this.showActionMenu = true
        // 添加触觉反馈
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      }, 500)
    },
    
    handleTouchEnd() {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer)
        this.touchTimer = null
      }
    },
    
    hideActionMenu() {
      this.showActionMenu = false
      this.selectedMessage = null
    },
    
    formatTime(date) {
      if (!date) return ''
      
      const now = new Date()
      const messageDate = new Date(date)
      const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60))
      
      if (diffInMinutes < 1) {
        return '刚刚'
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}小时前`
      } else if (diffInMinutes < 10080) {
        return `${Math.floor(diffInMinutes / 1440)}天前`
      } else {
        return messageDate.toLocaleDateString()
      }
    },
    
    getCategoryName(type) {
      const category = this.categories.find(c => c.key === type)
      return category ? category.name : '未知类型'
    },
    
    showToast(type, title, message) {
      // 简单的消息提示实现
      const toast = document.createElement('div')
      toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all transform translate-y-0 opacity-100 ${
        type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 
        type === 'error' ? 'bg-red-50 border-l-4 border-red-500' : 
        'bg-blue-50 border-l-4 border-blue-500'
      }`
      
      const iconColor = type === 'success' ? 'text-green-500' : 
                        type === 'error' ? 'text-red-500' : 
                        'text-blue-500'
      
      let icon = ''
      if (type === 'success') {
        icon = `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`
      } else if (type === 'error') {
        icon = `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>`
      }
      
      toast.innerHTML = `
        <div class="${iconColor}">${icon}</div>
        <div>
          <div class="font-medium ${type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800'}">${title}</div>
          <div class="text-sm ${type === 'success' ? 'text-green-700' : type === 'error' ? 'text-red-700' : 'text-blue-700'}">${message}</div>
        </div>
      `
      
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.replace('translate-y-0', '-translate-y-12')
        toast.classList.replace('opacity-100', 'opacity-0')
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 300)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>