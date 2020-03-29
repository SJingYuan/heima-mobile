import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 按需加载配置路由
const Layout = () => import('../views/layout')
const home = () => import('../views/home') // 二级路由
const question = () => import('../views/question') // 二级路由
const user = () => import('../views/user') // 二级路由
const video = () => import('../views/video') // 二级路由
// -----其他的一级路由
const chat = () => import('../views/user/chat.vue') // 小智
const login = () => import('../views/login') // 登陆
const profile = () => import('../views/user/profile.vue') // 编辑资料
const search = () => import('../views/search') // 搜索
const searchResult = () => import('../views/search/result.vue') // 搜索结果
const article = () => import('../views/article') // 文章详情
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 一级路由
    children: [{
      path: '',
      component: home, // 二级，首页
      meta: { isAlive: true } // 是否缓存组件实例
    },
    {
      path: '/question',
      component: question // 二级，问答
    },
    {
      path: '/video',
      component: video // 二级，视频
    },
    {
      path: '/user',
      component: user // 二级，用户
    }
    ]
  },
  {
    path: '/user/chat', // 一级，小智
    component: chat
  },
  {
    path: '/login',
    component: login // 一级， 登陆
  },
  {
    path: '/user/profile', // 一级，编辑资料
    component: profile
  },
  {
    path: '/search', // 一级，搜索
    component: search
  },
  {
    path: '/search/result', // 一级，搜索结果
    component: searchResult
  },
  {
    path: '/article', // 一级，文章详情
    component: article
  }
]

const router = new VueRouter({
  routes
})

export default router
