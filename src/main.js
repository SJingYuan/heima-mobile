import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
import Vant, { Lazyload } from 'vant'// 引入vant组件
import 'vant/lib/index.less'
// import 'vant/lib/index.css' // 引入vant组件样式
import plugin from '@/utils/plugin'
import 'amfe-flexible'
import '@/styles/index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
Vue.use(Vant) // 全局注册vant
Vue.use(Lazyload) // 懒加载
Vue.use(plugin)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
