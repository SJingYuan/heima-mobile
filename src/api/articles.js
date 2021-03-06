// 处理文章列表数据
import request from '../utils/request'
// 获取文章数据
export function getArticle (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
  })
}
// 不喜欢文章接口
export function disLikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
// 举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}

// 获取文章搜索的建议
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
// 获取文章搜索的结果
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
// 获取文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
// 获取评论或者获取评论回复
export function getComments (params) {
  return request({
    url: '/comments', // 请求地址
    params
  })
}
// 封装评论或者回复评论的方法
export function commentOrReply (data) {
  return request({
    url: '/comments', // 请求地址
    method: 'post', // 请求类型不同
    data
  })
}
