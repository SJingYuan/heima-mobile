import router from '../router' // 引入路由实例
import store from '../store'
// 前置守卫
router.beforeEach(function (to, from, next) {
  // 如果是/user 为起始 要进行对token判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    })
  } else {
    next() // 直接放行
  }
})
