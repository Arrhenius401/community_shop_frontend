import { createRouter, createWebHistory } from 'vue-router';

// 引入user相关的界面组件
import UserHome from '../views/Home.vue';
import UserLogin from '../views/user/UserLogin.vue';
import UserProfile from '../views/user/UserProfile.vue';
import UserChat from '../views/user/UserChat.vue';
import UserRegister from '../views/user/UserRegister.vue';
import UserForgotPassword from '../views/user/UserForgotPassword.vue';

// 引入message相关的界面组件
import MessageCenter from '@/views/message/MessageCenter.vue';
import MessageDetail from '@/views/message/MessageDetail.vue';

// 引入post相关的界面组件
import PostDetail from '../views/post/PostDetail.vue';
import PostCreate from '../views/post/PostCreate.vue';

// 引入product相关的界面组件
import ProductList from '../views/product/ProductList.vue';
import ProductDetail from '../views/product/ProductDetail.vue';

// 引入order相关的界面组件
import OrderDetail from '../views/Order/OrderDetail.vue';
import OrderConfirm from '../views/Order/OrderConfirm.vue';
import OrderPayment from '../views/Order/OrderPayment.vue';

// 引入管理员相关的界面组件
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import ProductManagement from '@/views/admin/ProductManagement.vue';
import UserManagement from '@/views/admin/UserManagement.vue';
import PostManagement from '@/views/admin/PostManagement.vue';

import { checkIsAdmin, checkIsLogin } from '@/api/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: UserHome,
    meta:{
      title: '主页 - Graygoo的web'
    }
  },{
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
    meta:{
      requiresGuest: true,
      title: '登录 - Graygoo的web'
    }
  },{
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      requiresAuth: true,
      title: '个人资料 - Graygoo的web'
    }
  },{
    path: '/userChat',
    name: 'UserChat',
    component: UserChat,
    meta: { 
      requiresAuth: true,
      title: '消息 - Graygoo的web'
    }
  },{
    path: '/register',
    name: 'UserRegister',
    component: UserRegister,
    meta:{
      requiresGuest: true,
      title: '注册 - Graygoo的web'
    }
  },{
    path: '/forgetPassword',
    name: 'UserForgetPassword',
    component: UserForgotPassword,
    meta:{
      requiresGuest: true,
      title: '找回密码 - Graygoo的web'
    }
  },{
    path: '/messageCenter',
    name: 'MessageCenter',
    component: MessageCenter,
    meta: { 
      requiresAuth: true,
      title: '消息中心 - Graygoo的web'
    }
  },{
    path: '/messageDetail/:id',
    name: 'MessageDetail',
    component: MessageDetail,
    meta: { 
      requiresAuth: true,
      title: '消息详情 - Graygoo的web'
    }
  },{
    path: '/postDetail/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta:{
      title: '帖子详情 - Graygoo的web'
    }
  },{
    path: '/postCreate',
    name: 'PostCreate',
    component: PostCreate,
    meta:{
      title: '发布帖子 - Graygoo的web'
    }
  },{
    path: '/productList',
    name: 'ProductList',
    component: ProductList,
    meta:{
      title: '商品列表 - Graygoo的web'
    }
  },{
    path: '/productDetail/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta:{
      title: '商品详情 - Graygoo的web'
    }
  },{
    path: '/orderDetail/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      requiresAuth: true,
      title: '订单详情 - Graygoo的web'
    }
  },{
    path: '/orderConfirm',
    name: 'OrderConfirm',
    component: OrderConfirm,
    meta: { 
      requiresAuth: true,
      title: '订单确认 - Graygoo的web'
    }
  },{
    path: '/orderPayment',
    name: 'OrderPayment',
    component: OrderPayment,
    meta: { 
      requiresAuth: true,
      title: '支付 - Graygoo的web'
    }
  },{
    path: '/adminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: '控制台 - Graygoo的web'
    }
  },{
    path: '/productManagement',
    name: 'ProductManagement',
    component: ProductManagement,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: '商品管理 - Graygoo的web'
    }
  },{
    path: '/userManagement',
    name: 'UserManagement',
    component: UserManagement,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: '用户管理 - Graygoo的web'
    }
  },{
    path: '/postManagement',
    name: 'PostManagement',
    component: PostManagement,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: '帖子管理 - Graygoo的web'
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

//全局前置守卫（Global Before Guards），用于在路由切换前执行功能，常用于权限验证
router.beforeEach(async (to, from, next) => {
  let isAuthenticated = false;
  try {
    const localToken = JSON.parse(window.localStorage.getItem('local-token'));
    if (localToken) {
      isAuthenticated = await checkIsLogin();
    }
  } catch (error) {
    console.error('认证检查失败:', error);
    isAuthenticated = false;
  }

  console.log("跳转界面中,认证状态: ", isAuthenticated);

  // 已登录用户访问游客页面，重定向到首页
  if (to.meta.requiresGuest && isAuthenticated) {
    window.localStorage.removeItem('local-token');
    next();
    return;
  }
  
  // 未登录用户访问需要认证的页面，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 管理员权限校验
  if (to.meta.requiresAdmin) {
    try {
      const isAdmin = await checkIsAdmin();
      console.log("管理身份认证状态: ", isAdmin);
      if (!isAdmin) {
        next('/'); // 无权限重定向到首页
        return;
      }
    } catch (error) {
      console.error('管理员权限检查失败:', error);
      next('/');
      return;
    }
  }

  next(); // 正常放行
});

//全局后置守卫（Global After Guards），用于在路由切换后执行功能，常用于设置标题
router.afterEach((to) => {
  //设置页面标题
  if(to.meta.title){
    document.title = to.meta.title
  }else{
    document.title = 'graygoo的web'
  }
});

export default router;