const USER_TOKEN = 'heima-mobile' // 储存用户信息
// 设置用户信息
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 获取用户信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 如果前边位true后边不执行  如果后边位true前边不执行
}
// 删除用户信息
export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
