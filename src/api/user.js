import request from '../utils/request' // 引入请求模块
// 登陆
export function login (data) {
  return request({
    url: '/authorizations', // 地址
    method: 'post',
    data
  })
}
/** *关注用户***/
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
/** *取消关注***/
export function unFollowUser (autid) {
  return request({
    method: 'delete',
    url: `/user/followings/${autid}`
  })
}
