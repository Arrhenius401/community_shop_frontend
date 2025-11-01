<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部操作栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-medium text-gray-900">消息详情</h1>
          </div>
          <button @click="deleteMessage" class="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-600 transition-colors">
            删除
          </button>
        </div>
      </div>
    </header>

    <!-- 消息内容区 -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <!-- 发送方信息卡片 -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center">
            <!-- 发送方头像或系统图标 -->
            <div v-if="message.isSystemMessage" class="flex-shrink-0">
              <div class="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <img v-else :src="message.senderAvatar" :alt="message.senderName" class="h-12 w-12 rounded-full object-cover">
            
            <!-- 发送方信息 -->
            <div class="ml-4">
              <h2 class="text-lg font-medium text-gray-900">{{ message.senderName }}</h2>
              <p class="text-sm text-gray-500">{{ message.isSystemMessage ? '系统消息' : '普通用户' }}</p>
            </div>

            <!-- 发送时间 -->
            <div class="ml-auto text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatDate(message.sentTime) }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(message.sentTime) }}</p>
            </div>
          </div>
        </div>

        <!-- 消息正文区 -->
        <div class="p-6">
          <!-- 消息标题（如果有） -->
          <div v-if="message.title" class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ message.title }}</h3>
          </div>

          <!-- 消息内容（支持富文本） -->
          <div class="mb-6 text-gray-700 leading-relaxed">
            <div v-if="message.hasRichText" class="prose prose-sm max-w-none" v-html="message.content"></div>
            <div v-else class="whitespace-pre-wrap text-sm">{{ message.content }}</div>
          </div>

          <!-- 消息附加信息 -->
          <div v-if="message.attachments && message.attachments.length > 0" class="mb-6 pb-6 border-b border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">附件</h4>
            <div class="space-y-2">
              <div v-for="(attachment, index) in message.attachments" :key="index" class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ attachment.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- 相关订单信息（如果有） -->
          <div v-if="message.relatedOrder" class="mb-6 pb-6 border-b border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">相关订单</h4>
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-900">订单号：{{ message.relatedOrder.orderNumber }}</p>
                <span :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(message.relatedOrder.status)}`">
                  {{ getOrderStatusText(message.relatedOrder.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ message.relatedOrder.productName }}</p>
              <p class="text-sm text-danger font-medium mt-1">¥{{ message.relatedOrder.amount }}</p>
            </div>
          </div>

          <!-- 消息元信息 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p class="text-xs text-gray-500 mb-1">消息ID</p>
              <p class="text-sm font-medium text-gray-900">#{{ message.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">消息类型</p>
              <p class="text-sm font-medium text-gray-900">{{ getMessageTypeText(message.type) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">状态</p>
              <span :class="`px-2 py-1 text-xs font-medium rounded-full inline-block ${message.isRead ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'}`">
                {{ message.isRead ? '已读' : '未读' }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">来源</p>
              <p class="text-sm font-medium text-gray-900">{{ message.source }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="mt-6 flex space-x-3">
        <button @click="markAsRead" v-if="!message.isRead" class="flex-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
          标记为已读
        </button>
        <button @click="reply" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors">
          回复
        </button>
        <button @click="goBack" class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          返回
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: {
        id: 'MSG-001',
        senderName: '系统管理员',
        senderAvatar: '/placeholder.svg?height=48&width=48',
        isSystemMessage: true,
        sentTime: new Date('2024-01-20 14:30:00'),
        title: '订单确认通知',
        content: `<p>您好，感谢您的订单！</p>
                  <p style="margin-top: 16px;">以下是订单摘要：</p>
                  <ul style="margin-top: 8px; padding-left: 24px;">
                    <li>商品：iPhone 13 Pro 256GB</li>
                    <li>价格：¥6999</li>
                    <li>数量：1</li>
                    <li>总金额：¥6999</li>
                  </ul>
                  <p style="margin-top: 16px;">订单已提交，您可以在订单详情页面查看物流信息。如有任何问题，请随时与我们联系。</p>`,
        hasRichText: true,
        isRead: false,
        type: 'order',
        source: '系统',
        attachments: [
          { name: '订单详情.pdf', size: 2048 },
          { name: '发票.pdf', size: 1024 }
        ],
        relatedOrder: {
          orderNumber: 'ORD-20240120-001',
          productName: 'iPhone 13 Pro 256GB',
          amount: 6999,
          status: 'shipped'
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    },
    getStatusBadgeClass(status) {
      return {
        pending: 'bg-yellow-50 text-yellow-700',
        shipped: 'bg-blue-50 text-blue-700',
        delivered: 'bg-green-50 text-green-700',
        cancelled: 'bg-red-50 text-red-700'
      }[status]
    },
    getOrderStatusText(status) {
      return {
        pending: '待发货',
        shipped: '已发货',
        delivered: '已送达',
        cancelled: '已取消'
      }[status]
    },
    getMessageTypeText(type) {
      return {
        order: '订单相关',
        system: '系统消息',
        notification: '通知',
        promotion: '推广'
      }[type]
    },
    markAsRead() {
      this.message.isRead = true
      alert('消息已标记为已读')
    },
    reply() {
      alert('打开回复界面')
    },
    deleteMessage() {
      if (confirm('确定要删除这条消息吗？')) {
        alert('消息已删除')
        this.goBack()
      }
    },
    goBack() {
      alert('返回消息列表')
    }
  }
}
</script>

<style scoped>
.text-primary { color: #1E90FF; }
.text-danger { color: #FF6B6B; }
.text-success { color: #10B981; }
.bg-primary { background-color: #1E90FF; }
.bg-danger { background-color: #FF6B6B; }
.bg-success { background-color: #10B981; }
.border-primary { border-color: #1E90FF; }

.prose-sm {
  font-size: 0.875rem;
  line-height: 1.5;
}

.prose-sm p {
  margin-top: 1rem;
  margin-bottom: 0;
}

.prose-sm ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose-sm li {
  margin-top: 0.25rem;
}
</style>
