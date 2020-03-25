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
// 获取用户个人信息
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
// 获取用户个人资料
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
// 编辑用户头像的
export function updateImg (data) {
  return request({
    url: '/user/photo', // 编辑头像的地址
    method: 'patch', // 设置头像的类型
    data
  })
}
// 保存用户信息
export function saveUserInfo (data) {
  return request({
    url: '/user/profile', // 编辑资料的地址
    data: { ...data, photo: null },
    method: 'patch'
  })
}
