// 请求管理工具
import axios from 'axios'
// 引入大数字插件
import JSONBig from 'json-bigint'
import store from '../store/'
import router from '../router'
// new 一个新实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  transformRequest: [function (data) {
    return data ? JSONBig.parse(data) : {}
  }]
})
// token注入
instance.interceptors.request.use(function (config) {
  // 成功处理// token注入headers
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // -----第二种
  // config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
},
function (error) {
  // 失败返回错误
  return Promise.reject(error)
})
// 响应拦截器 将多嵌套的数据结构出来
instance.interceptors.response.use(function (response) {
// 成功
  try {
    // 成功返回两层
    return response.data.data
  } catch (error) {
    // 失败说明response.data不存在 两层解不开返回一层
    return response.data
  }
},
async function (error) {
  // 如果状态码是401，处理token失效问题
  if (error.response.status === 401) {
    const path = {
      path: '/login', // 地址
      query: {
        redirectUrl: router.currentRoute.fullPath
      }
    }
    if (store.state.user.refresh_token) {
      // /authorizations
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${store.state.user.token}` }
        })
        // 更新vuex的数据
        store.commit('updateUser', {
          user: {
            token: result.data.data.token, // 新token
            refresh_token: store.state.user.token // 原来的token，十四天之后过期
          }
        })
        return instance(error.config)
      } catch (error) {
        store.commit('delUser') // 删除失效token
        router.push(path)
      }
    } else {
      store.commit('delUser') // 删除失效token
      router.push(path)
    }
  }
  // 失败
  return Promise.reject(error)
})
export default instance
