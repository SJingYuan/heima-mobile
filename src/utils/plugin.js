//  ----处理小函数以及vue中常用的过滤器及小函数
import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 相对时间插件
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // dayjs扩展相对时间方法
export default {
  // 导出默认对象
  install (Vue) {
    // 在Vue.use时调用
    // 给vue原型赋值一个函数，自定义函数名
    Vue.prototype.$snotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义vue原型属性$sleep
    // 全局过滤器
    Vue.filter('relTime', relTime)
  }
}
// 休眠函数
function sleep (time = 500) {
  // 返回promise
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
