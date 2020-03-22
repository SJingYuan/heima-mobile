// 处理频道数据
import request from '../utils/request'
// 获取我的频道数据
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
//  获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
