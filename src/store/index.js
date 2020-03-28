import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 放置token
    user: auth.getUser(),
    photo: null
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 载荷数据给state
      // 最新的数据存入本地缓存
      auth.setUser(payload.user)
    },
    // 删除token
    delUser (state) {
      state.user = {}
      auth.delUser() // 删除本地缓存的token
    },
    updatePhoto (state, payload) {
      state.photo = payload.photo // 将载荷里面的数据设置给state
    }
  },
  actions: {
  },
  modules: {
  }
})
