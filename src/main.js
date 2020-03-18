import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
import Vant from 'vant'// 引入vant组件
import 'vant/lib/index.less'
// import 'vant/lib/index.css' // 引入vant组件样式
import plugin from '@/utils/plugin'
import 'amfe-flexible'
import '@/styles/index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
Vue.use(Vant) // 全局注册vant
Vue.use(plugin)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
