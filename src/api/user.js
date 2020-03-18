import request from '../utils/request' // 引入请求模块
// 登陆
export function login (data) {
  return request({
    url: '/authorizations', // 地址
    method: 'post',
    data
  })
}
