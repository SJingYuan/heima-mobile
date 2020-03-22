// 处理频道数据
import request from '../utils/request'
import store from '@/store'
const CACHE_CHANNEL_V = '' // 登陆用户
const CACHE_CHANNEL_T = '' // 游客用户
// 获取我的频道数据
// export function getMyChannels () {
//   return request({
//     url: '/user/channels'
//   })
// }
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

//  获取所有频道
export function getMyChannels () {
  // return request({
  //   url: '/channels'
  // })
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const str = localStorage.getItem(key)
    if (str) {
      resolve({ channels: JSON.parse(str) })
    } else {
      request({ url: '/user/channels' }).then(result => {
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result)
      })
    }
  })
}
// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    let channels = JSON.parse(localStorage.getItem(key))
    channels = channels.filter(item => item.id !== id)
    localStorage.setItem(key, JSON.stringify(channels))
  })
}
// 添加我的频道
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))
    channels.push(channel) // 添加
    localStorage.setItem(key, JSON.stringify(channels))
    resolve()
  })
}
