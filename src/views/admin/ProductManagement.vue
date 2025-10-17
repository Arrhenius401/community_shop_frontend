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
          <h1 class="text-xl font-medium text-gray-900">商品管理</h1>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">搜索</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="商品名称或ID" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
            <select v-model="filters.category" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部分类</option>
              <option value="electronics">数码电子</option>
              <option value="books">图书教材</option>
              <option value="furniture">家具家居</option>
              <option value="sports">运动户外</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">全部状态</option>
              <option value="available">在售</option>
              <option value="sold">已售</option>
              <option value="pending">待审核</option>
              <option value="rejected">已下架</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
            <select v-model="sorting" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="time-desc">最新发布</option>
              <option value="price-asc">价格升序</option>
              <option value="price-desc">价格降序</option>
              <option value="views-desc">浏览最多</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="resetFilters" class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 商品网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <!-- 商品图片 -->
          <div class="relative h-40 bg-gray-100">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            <span :class="getStatusBadgeClass(product.status)" class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusText(product.status) }}
            </span>
          </div>
          
          <!-- 商品信息 -->
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-900 mb-1 truncate">{{ product.name }}</h3>
            <div class="flex items-center text-xs text-gray-500 mb-2">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ product.seller }}
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-lg font-semibold text-danger">¥{{ product.price }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ getCategoryText(product.category) }}</span>
            </div>
            <div class="flex items-center text-xs text-gray-400 mb-3">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {{ product.views }} 浏览
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2">
              <button @click="viewProduct(product)" class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-blue-600">
                查看
              </button>
              <button v-if="product.status === 'pending'" @click="approveProduct(product)" class="px-3 py-1.5 text-xs font-medium text-white bg-success rounded-lg hover:bg-green-700">
                通过
              </button>
              <button v-if="product.status === 'pending'" @click="rejectProduct(product)" class="px-3 py-1.5 text-xs font-medium text-white bg-danger rounded-lg hover:bg-red-700">
                拒绝
              </button>
              <button v-if="product.status === 'available'" @click="takeDownProduct(product)" class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                下架
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="mt-6 flex items-center justify-center">
        <div class="flex space-x-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            上一页
          </button>
          <span class="px-4 py-1.5 text-sm text-gray-700">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            下一页
          </button>
        </div>
      </div>
    </main>

    <!-- 详情模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">商品详情</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedProduct">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full rounded-lg border border-gray-200">
            </div>
            <div>
              <h2 class="text-xl font-medium text-gray-900 mb-2">{{ selectedProduct.name }}</h2>
              <span :class="getStatusBadgeClass(selectedProduct.status)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mb-4">
                {{ getStatusText(selectedProduct.status) }}
              </span>
              <div class="text-2xl font-semibold text-danger mb-4">¥{{ selectedProduct.price }}</div>
              <div class="space-y-2 text-sm mb-4 pb-4 border-b border-gray-200">
                <div class="flex justify-between">
                  <span class="text-gray-500">商品ID:</span>
                  <span class="text-gray-900">#{{ selectedProduct.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">分类:</span>
                  <span class="text-gray-900">{{ getCategoryText(selectedProduct.category) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">卖家:</span>
                  <span class="text-gray-900">{{ selectedProduct.seller }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">浏览量:</span>
                  <span class="text-gray-900">{{ selectedProduct.views }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">发布时间:</span>
                  <span class="text-gray-900">{{ selectedProduct.publishTime }}</span>
                </div>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">商品描述</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{{ selectedProduct.description }}</p>
              </div>
              <div class="flex space-x-3 mt-6">
                <button v-if="selectedProduct.status === 'pending'" @click="approveProduct(selectedProduct); showModal = false" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-success rounded-lg hover:bg-green-700">
                  通过审核
                </button>
                <button v-if="selectedProduct.status === 'pending'" @click="rejectProduct(selectedProduct); showModal = false" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-700">
                  拒绝审核
                </button>
                <button v-if="selectedProduct.status === 'available'" @click="takeDownProduct(selectedProduct); showModal = false" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700">
                  下架商品
                </button>
                <button v-if="selectedProduct.status === 'rejected'" @click="approveProduct(selectedProduct); showModal = false" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600">
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
  data() {
    return {
      filters: {
        search: '',
        category: '',
        status: ''
      },
      sorting: 'time-desc',
      currentPage: 1,
      pageSize: 12,
      showModal: false,
      selectedProduct: null,
      products: [
        { id: 3001, name: 'iPhone 13 Pro 256GB', price: 6999, category: 'electronics', status: 'available', seller: '张三', views: 234, publishTime: '2024-01-15', image: '/placeholder.svg?height=160&width=300&text=iPhone', description: '9成新，无划痕，配件齐全，原装充电器和数据线，支持面交验货。' },
        { id: 3002, name: '高等数学教材（第七版）', price: 30, category: 'books', status: 'available', seller: '李四', views: 89, publishTime: '2024-01-14', image: '/placeholder.svg?height=160&width=300&text=教材', description: '全新未拆封，课程必备教材，同城可送货上门。' },
        { id: 3003, name: '山地自行车', price: 800, category: 'sports', status: 'sold', seller: '王五', views: 456, publishTime: '2024-01-13', image: '/placeholder.svg?height=160&width=300&text=自行车', description: '八成新，骑行流畅，变速器正常，适合日常通勤和运动。' },
        { id: 3004, name: '办公桌椅套装', price: 500, category: 'furniture', status: 'pending', seller: '赵六', views: 67, publishTime: '2024-01-12', image: '/placeholder.svg?height=160&width=300&text=桌椅', description: '宜家购入，质量很好，因搬家转让，桌面无划痕。' },
        { id: 3005, name: '羽毛球拍（李宁）', price: 120, category: 'sports', status: 'available', seller: '孙七', views: 123, publishTime: '2024-01-11', image: '/placeholder.svg?height=160&width=300&text=球拍', description: '李宁正品，适合初学者，手感不错，送球包。' },
        { id: 3006, name: '违规商品示例', price: 9999, category: 'electronics', status: 'rejected', seller: '周八', views: 12, publishTime: '2024-01-10', image: '/placeholder.svg?height=160&width=300&text=违规', description: '已下架处理。' },
      ]
    }
  },
  computed: {
    filteredProducts() {
      let result = [...this.products]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(search) || 
          product.id.toString().includes(search)
        )
      }
      
      if (this.filters.category) {
        result = result.filter(product => product.category === this.filters.category)
      }
      
      if (this.filters.status) {
        result = result.filter(product => product.status === this.filters.status)
      }
      
      result.sort((a, b) => {
        if (this.sorting === 'time-desc') return new Date(b.publishTime) - new Date(a.publishTime)
        if (this.sorting === 'price-asc') return a.price - b.price
        if (this.sorting === 'price-desc') return b.price - a.price
        if (this.sorting === 'views-desc') return b.views - a.views
        return 0
      })
      
      return result
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize)
    }
  },
  methods: {
    goBack() {
      alert('返回管理面板')
    },
    resetFilters() {
      this.filters = { search: '', category: '', status: '' }
      this.sorting = 'time-desc'
    },
    getStatusBadgeClass(status) {
      return {
        available: 'bg-green-50 text-green-700',
        sold: 'bg-gray-100 text-gray-700',
        pending: 'bg-yellow-50 text-yellow-700',
        rejected: 'bg-red-50 text-red-700'
      }[status]
    },
    getStatusText(status) {
      return { available: '在售', sold: '已售', pending: '待审核', rejected: '已下架' }[status]
    },
    getCategoryText(category) {
      return {
        electronics: '数码电子',
        books: '图书教材',
        furniture: '家具家居',
        sports: '运动户外'
      }[category]
    },
    viewProduct(product) {
      this.selectedProduct = product
      this.showModal = true
    },
    approveProduct(product) {
      product.status = 'available'
      alert(`商品 ${product.name} 已通过审核`)
    },
    rejectProduct(product) {
      product.status = 'rejected'
      alert(`商品 ${product.name} 已拒绝`)
    },
    takeDownProduct(product) {
      product.status = 'rejected'
      alert(`商品 ${product.name} 已下架`)
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
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
.focus\:ring-primary:focus { --tw-ring-color: #1E90FF; }
</style>