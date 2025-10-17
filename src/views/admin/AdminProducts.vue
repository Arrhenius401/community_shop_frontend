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
          <h1 class="text-2xl font-bold text-gray-900">商品管理</h1>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-6">
       搜索和筛选 
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="输入商品名称或ID搜索" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select 
              v-model="filters.category" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">全部分类</option>
              <option value="electronics">数码电子</option>
              <option value="furniture">家具家居</option>
              <option value="books">图书教材</option>
              <option value="clothing">服装配饰</option>
              <option value="sports">运动户外</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select 
              v-model="filters.status" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">全部状态</option>
              <option value="AVAILABLE">在售</option>
              <option value="SOLD">已售出</option>
              <option value="PENDING">待审核</option>
              <option value="REJECTED">已下架</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">排序方式</label>
            <div class="flex space-x-2">
              <select 
                v-model="sorting.field" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="productID">ID</option>
                <option value="createTime">发布时间</option>
                <option value="price">价格</option>
                <option value="viewCount">浏览量</option>
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

       商品列表 
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in filteredProducts" 
          :key="product.productID"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
           商品图片 
          <div class="relative h-48 bg-gray-200">
            <img 
              :src="product.image || '/placeholder.svg?height=192&width=384'" 
              :alt="product.name"
              class="w-full h-full object-cover"
            >
            <span 
              :class="[
                'absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full',
                product.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                product.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 
                product.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              ]"
            >
              {{ getStatusText(product.status) }}
            </span>
          </div>
          
           商品信息 
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{{ product.name }}</h3>
            </div>
            
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ product.sellerName }}
            </div>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl font-bold text-red-600">¥{{ product.price }}</span>
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {{ getCategoryText(product.category) }}
              </span>
            </div>
            
            <div class="flex items-center text-xs text-gray-500 space-x-4 mb-3">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ product.viewCount }} 浏览
              </span>
              <span>ID: {{ product.productID }}</span>
            </div>
            
            <div class="text-xs text-gray-400 mb-3">
              发布时间: {{ formatDate(product.createTime) }}
            </div>
            
             操作按钮 
            <div class="flex space-x-2">
              <button 
                @click="viewProduct(product)"
                class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看详情
              </button>
              <button 
                v-if="product.status === 'PENDING'"
                @click="approveProduct(product.productID)"
                class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                通过
              </button>
              <button 
                v-if="product.status === 'PENDING'"
                @click="rejectProduct(product.productID)"
                class="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                拒绝
              </button>
              <button 
                v-if="product.status === 'AVAILABLE'"
                @click="changeStatus(product.productID, 'REJECTED')"
                class="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                下架
              </button>
            </div>
          </div>
        </div>
      </div>

       分页 
      <div class="mt-6 flex items-center justify-center">
        <div class="flex space-x-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-4 py-2 text-sm text-gray-700">
            第 {{ currentPage }} / {{ Math.ceil(filteredProducts.length / pageSize) }} 页
          </span>
          <button 
            @click="currentPage = Math.min(Math.ceil(filteredProducts.length / pageSize), currentPage + 1)" 
            :disabled="currentPage >= Math.ceil(filteredProducts.length / pageSize)"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

     商品详情模态框 
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">商品详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6" v-if="selectedProduct">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             商品图片 
            <div>
              <img 
                :src="selectedProduct.image || '/placeholder.svg?height=400&width=400'" 
                :alt="selectedProduct.name"
                class="w-full rounded-lg"
              >
            </div>
            
             商品信息 
            <div class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h2>
                <span 
                  :class="[
                    'inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full',
                    selectedProduct.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                    selectedProduct.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 
                    selectedProduct.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  ]"
                >
                  {{ getStatusText(selectedProduct.status) }}
                </span>
              </div>
              
              <div class="text-3xl font-bold text-red-600">¥{{ selectedProduct.price }}</div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">商品ID:</span>
                  <span class="text-gray-900">{{ selectedProduct.productID }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">分类:</span>
                  <span class="text-gray-900">{{ getCategoryText(selectedProduct.category) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">卖家:</span>
                  <span class="text-gray-900">{{ selectedProduct.sellerName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">成色:</span>
                  <span class="text-gray-900">{{ selectedProduct.condition }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">浏览量:</span>
                  <span class="text-gray-900">{{ selectedProduct.viewCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">发布时间:</span>
                  <span class="text-gray-900">{{ formatDate(selectedProduct.createTime) }}</span>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-2">商品描述</h3>
                <p class="text-gray-600 text-sm">{{ selectedProduct.description }}</p>
              </div>
              
              <div class="flex space-x-3 pt-4">
                <button 
                  v-if="selectedProduct.status === 'PENDING'"
                  @click="approveProduct(selectedProduct.productID); showModal = false"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  通过审核
                </button>
                <button 
                  v-if="selectedProduct.status === 'PENDING'"
                  @click="rejectProduct(selectedProduct.productID); showModal = false"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  拒绝审核
                </button>
                <button 
                  v-if="selectedProduct.status === 'AVAILABLE'"
                  @click="changeStatus(selectedProduct.productID, 'REJECTED'); showModal = false"
                  class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  下架商品
                </button>
                <button 
                  v-if="selectedProduct.status === 'REJECTED'"
                  @click="changeStatus(selectedProduct.productID, 'AVAILABLE'); showModal = false"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  恢复上架
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminProducts',
  data() {
    return {
      filters: {
        search: '',
        category: '',
        status: ''
      },
      sorting: {
        field: 'createTime',
        order: 'desc'
      },
      currentPage: 1,
      pageSize: 9,
      products: [],
      showModal: false,
      selectedProduct: null
    }
  },
  computed: {
    filteredProducts() {
      let result = [...this.products]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(product => 
          product.productID.toString().includes(search) || 
          product.name.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.category) {
        result = result.filter(product => product.category === this.filters.category)
      }
      
      if (this.filters.status) {
        result = result.filter(product => product.status === this.filters.status)
      }
      
      result.sort((a, b) => {
        let comparison = 0
        if (this.sorting.field === 'productID') {
          comparison = a.productID - b.productID
        } else if (this.sorting.field === 'createTime') {
          comparison = new Date(a.createTime) - new Date(b.createTime)
        } else if (this.sorting.field === 'price') {
          comparison = a.price - b.price
        } else if (this.sorting.field === 'viewCount') {
          comparison = a.viewCount - b.viewCount
        }
        return this.sorting.order === 'asc' ? comparison : -comparison
      })
      
      const start = (this.currentPage - 1) * this.pageSize
      return result.slice(start, start + this.pageSize)
    }
  },
  mounted() {
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      // 模拟数据加载
      const categories = ['electronics', 'furniture', 'books', 'clothing', 'sports', 'other']
      const statuses = ['AVAILABLE', 'SOLD', 'PENDING', 'REJECTED']
      const conditions = ['全新', '99新', '95新', '9成新', '8成新']
      
      this.products = Array.from({ length: 50 }, (_, i) => ({
        productID: i + 1,
        name: `商品 ${i + 1}`,
        price: Math.floor(Math.random() * 10000) + 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        sellerName: `卖家${i + 1}`,
        viewCount: Math.floor(Math.random() * 1000),
        createTime: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        description: '这是一个很好的商品，质量优良，价格实惠。',
        image: null
      }))
    },
    async changeStatus(productId, status) {
      const product = this.products.find(p => p.productID === productId)
      if (product) {
        product.status = status
      }
      this.showToast('success', '操作成功', `商品状态已更改为${this.getStatusText(status)}`)
    },
    async approveProduct(productId) {
      await this.changeStatus(productId, 'AVAILABLE')
    },
    async rejectProduct(productId) {
      await this.changeStatus(productId, 'REJECTED')
    },
    viewProduct(product) {
      this.selectedProduct = { ...product }
      this.showModal = true
    },
    getStatusText(status) {
      const map = { 
        'AVAILABLE': '在售', 
        'SOLD': '已售出', 
        'PENDING': '待审核', 
        'REJECTED': '已下架' 
      }
      return map[status] || '未知'
    },
    getCategoryText(category) {
      const map = {
        'electronics': '数码电子',
        'furniture': '家具家居',
        'books': '图书教材',
        'clothing': '服装配饰',
        'sports': '运动户外',
        'other': '其他'
      }
      return map[category] || '未知'
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
