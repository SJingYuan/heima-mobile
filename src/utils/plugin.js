//  ----处理小函数以及vue中常用的过滤器及小函数
export default {
  // 导出默认对象
  install (Vue) {
    // 在Vue.use时调用
    // 给vue原型赋值一个函数，自定义函数名
    Vue.prototype.$snotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
