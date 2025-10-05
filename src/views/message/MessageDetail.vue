<template>
  <div class="min-h-screen bg-gray-50">
     顶部操作栏 
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button @click="$router.go(-1)" class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="text-sm font-medium">返回</span>
          </button>
          
          <div class="flex items-center space-x-3">
            <button 
              v-if="message && !message.isRead"
              @click="markAsRead"
              class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
              title="标记已读"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            
            <button 
              @click="showDeleteConfirm = true"
              class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              title="删除消息"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

     加载状态 
    <div v-if="loading" class="max-w-md mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="flex items-center space-x-4 mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

     消息内容 
    <div v-else-if="message" class="max-w-md mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
         消息头部 
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start space-x-4">
             发送方头像 
            <div class="flex-shrink-0">
              <div v-if="message.senderType === 'system'" class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <img v-else :src="message.senderAvatar || '/placeholder.svg?height=48&width=48'" :alt="message.senderName" class="w-12 h-12 rounded-full object-cover">
            </div>

             发送方信息 
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-lg font-semibold text-gray-900 truncate">{{ message.senderName }}</h2>
                <span v-if="!message.isRead" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  未读
                </span>
              </div>
              <p class="text-sm text-gray-500 mb-2">{{ formatTime(message.sendTime) }}</p>
              <div class="flex items-center">
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {{ getCategoryName(message.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>

         消息标题 
        <div class="px-6 py-4 border-b border-gray-100">
          <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ message.title }}</h1>
        </div>

         消息正文 
        <div class="p-6">
          <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="message.content"></div>
        </div>

         关联操作区 
        <div v-if="message.type === 'order' && message.orderId" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              关联订单：{{ message.orderId }}
            </div>
            <button 
              @click="viewOrder"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              查看订单
            </button>
          </div>
        </div>

         消息底部信息 
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>消息ID: {{ message.msgId }}</span>
            <span>{{ formatFullTime(message.sendTime) }}</span>
          </div>
        </div>
      </div>
    </div>

     错误状态 
    <div v-else class="max-w-md mx-auto p-4">
      <div class="flex flex-col items-center justify-center py-16">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p class="text-gray-500 text-lg font-medium mb-2">消息不存在</p>
        <p class="text-gray-400 text-sm mb-4">该消息可能已被删除或不存在</p>
        <button 
          @click="$router.go(-1)"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回消息列表
        </button>
      </div>
    </div>

     删除确认对话框 
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" @click="showDeleteConfirm = false">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6" @click.stop>
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">确认删除</h3>
        </div>
        <p class="text-gray-600 mb-6">确定要删除这条消息吗？删除后将无法恢复。</p>
        <div class="flex space-x-3">
          <button 
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button 
            @click="deleteMessage"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageDetail',
  data() {
    return {
      loading: true,
      message: null,
      showDeleteConfirm: false
    }
  },
  
  mounted() {
    this.loadMessage()
  },
  
  methods: {
    async loadMessage() {
      const msgId = this.$route.params.msgId
      if (!msgId) {
        this.$router.push({ name: 'MessageCenter' })
        return
      }
      
      this.loading = true
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据
        const types = ['order', 'system', 'service']
        const type = types[Math.floor(Math.random() * types.length)]
        
        this.message = {
          msgId: msgId,
          type: type,
          title: this.generateTitle(type, msgId),
          content: this.generateContent(type, msgId),
          sendTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          isRead: Math.random() > 0.3,
          senderType: type === 'system' ? 'system' : 'user',
          senderName: type === 'system' ? '系统消息' : `用户${Math.floor(Math.random() * 100)}`,
          senderAvatar: type === 'system' ? null : `/placeholder.svg?height=48&width=48&text=U${msgId}`,
          orderId: type === 'order' ? `ORD${Date.now()}${msgId}` : null
        }
        
        // 自动标记为已读
        if (!this.message.isRead) {
          setTimeout(() => {
            this.markAsRead(false)
          }, 1000)
        }
      } catch (error) {
        console.error('获取消息详情失败:', error)
        this.message = null
      } finally {
        this.loading = false
      }
    },
    
    generateTitle(type, id) {
      switch (type) {
        case 'order':
          return `订单 #${id} 状态更新通知`
        case 'system':
          return `系统公告 - 重要通知 ${id}`
        case 'service':
          return `售后服务进度更新 ${id}`
        default:
          return `消息标题 ${id}`
      }
    },
    
    generateContent(type, id) {
      switch (type) {
        case 'order':
          return `<div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">订单状态更新</h3>
            <p class="text-gray-700">尊敬的用户，您的订单状态已更新：</p>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-green-800 font-medium">商品已发货</span>
              </div>
              <div class="mt-2 text-sm text-green-700">
                <p><strong>快递单号：</strong>SF123456789${id}</p>
                <p><strong>快递公司：</strong>顺丰速运</p>
                <p><strong>预计送达：</strong>3-5个工作日</p>
              </div>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-medium text-blue-900 mb-2">物流跟踪</h4>
              <div class="space-y-2 text-sm text-blue-800">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>商品已从仓库发出</span>
                  <span class="ml-auto text-blue-600">${new Date().toLocaleString()}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>运输中</span>
                </div>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>派送中</span>
                </div>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>已签收</span>
                </div>
              </div>
            </div>
            
            <p class="text-gray-700">如有任何疑问，请随时联系我们的客服团队。</p>
            
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">联系方式</h4>
              <div class="text-sm text-gray-700 space-y-1">
                <p><strong>客服热线：</strong>400-123-4567</p>
                <p><strong>在线客服：</strong>工作日 9:00-18:00</p>
                <p><strong>邮箱：</strong>service@example.com</p>
              </div>
            </div>
          </div>`
        case 'system':
          return `<div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">系统维护通知</h3>
            <p class="text-gray-700">亲爱的用户：</p>
            <p class="text-gray-700">为了给您提供更好的服务体验，我们将进行系统维护升级。</p>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                  <h4 class="font-medium text-yellow-900 mb-2">维护时间</h4>
                  <p class="text-yellow-800 text-sm">今晚 23:00 - 明日 01:00</p>
                </div>
              </div>
            </div>
            
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-medium text-red-900 mb-2">影响功能</h4>
              <ul class="text-sm text-red-800 space-y-1">
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  订单提交和支付功能
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  消息推送服务
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  部分页面访问
                </li>
              </ul>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-medium text-green-900 mb-2">升级内容</h4>
              <ul class="text-sm text-green-800 space-y-1">
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  优化系统性能
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  增强安全防护
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  修复已知问题
                </li>
              </ul>
            </div>
            
            <p class="text-gray-700">维护期间给您带来的不便，我们深表歉意。感谢您的理解与支持！</p>
            
            <div class="text-center">
              <p class="text-sm text-gray-500">如有紧急问题，请联系客服热线：400-123-4567</p>
            </div>
          </div>`
        case 'service':
          return `<div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">售后服务进度更新</h3>
            <p class="text-gray-700">您好，您申请的售后服务有新的进展：</p>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-medium text-blue-900 mb-3">服务信息</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-blue-700 font-medium">服务类型：</span>
                  <span class="text-blue-800">退换货</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">服务单号：</span>
                  <span class="text-blue-800">SRV${Date.now()}${id}</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">申请时间：</span>
                  <span class="text-blue-800">${new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">处理状态：</span>
                  <span class="text-blue-800">处理中</span>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-medium text-green-900 mb-3">处理进度</h4>
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-900">服务申请已受理</p>
                    <p class="text-xs text-green-700">${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-900">客服已联系您</p>
                    <p class="text-xs text-green-700">${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-blue-900">等待商品寄回</p>
                    <p class="text-xs text-blue-700">请按照客服提供的地址寄回商品</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-500">商品质检</p>
                    <p class="text-xs text-gray-400">收到商品后进行质检</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-500">退款处理</p>
                    <p class="text-xs text-gray-400">质检通过后处理退款</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 class="font-medium text-yellow-900 mb-2">温馨提示</h4>
                  <ul class="text-sm text-yellow-800 space-y-1">
                    <li>• 请在7天内将商品寄回，超时可能影响退款处理</li>
                    <li>• 寄回时请保持商品完好，包装完整</li>
                    <li>• 建议选择有跟踪号的快递服务</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">寄回地址</h4>
              <div class="text-sm text-gray-700 space-y-1">
                <p><strong>收件人：</strong>售后服务中心</p>
                <p><strong>电话：</strong>400-123-4567</p>
                <p><strong>地址：</strong>北京市朝阳区xxx路xxx号xxx大厦xxx室</p>
                <p><strong>邮编：</strong>100000</p>
              </div>
            </div>
            
            <p class="text-gray-700">如有任何疑问，请随时联系我们的客服团队。我们将竭诚为您服务！</p>
          </div>`
        default:
          return `<p class="text-gray-700">这是消息 ${id} 的详细内容。</p>`
      }
    },
    
    async markAsRead(showToast = true) {
      if (!this.message || this.message.isRead) return
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        this.message.isRead = true
        
        if (showToast) {
          this.showToast('success', '操作成功', '消息已标记为已读')
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        if (showToast) {
          this.showToast('error', '操作失败', '标记已读失败，请重试')
        }
      }
    },
    
    async deleteMessage() {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        this.showDeleteConfirm = false
        this.showToast('success', '删除成功', '消息已删除')
        
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          this.$router.push({ name: 'MessageCenter' })
        }, 1000)
      } catch (error) {
        console.error('删除消息失败:', error)
        this.showDeleteConfirm = false
        this.showToast('error', '删除失败', '删除消息失败，请重试')
      }
    },
    
    viewOrder() {
      if (!this.message || !this.message.orderId) return
      
      // 跳转到订单详情页
      this.$router.push({
        name: 'OrderDetail',
        params: { orderId: this.message.orderId }
      })
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
    
    formatFullTime(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    },
    
    getCategoryName(type) {
      const categories = {
        'all': '全部消息',
        'order': '订单通知',
        'system': '系统公告',
        'service': '售后提醒'
      }
      return categories[type] || '未知类型'
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
.prose {
  color: inherit;
}

.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.prose h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>