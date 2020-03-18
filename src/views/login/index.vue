<template>
  <div class="container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 手机号  验证码  登录按钮 -->
    <van-cell-group>
      <van-field
      @blur="checkMobile"
        :error-message="errorMessage.mobile"
        v-model.trim="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
      @blur="checkCode"
        :error-message="errorMessage.code"
        v-model.trim="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <!-- slot指定给哪个坑填内容 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn-box">
      <van-button @click="login" type="info" size="small" round block>登录</van-button>
    </div>
  </div>
</template>

<script>
// import * as user from '../../api/user'
import { login } from '../../api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      errorMessage: {
        mobile: '', // 手机错误消息
        code: '' // 验证码
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']),
    // 检查手机号
    checkMobile () {
      // 判断是否为空
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      // 判断手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      this.errorMessage.mobile = ''
      return true
    },
    // 检查验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须是六位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    async login () {
      if (this.checkMobile() && this.checkCode()) {
        try {
          const result = await login(this.loginForm)
          this.updateUser({ user: result })
          const { redirectUrl } = this.$route.query
          // 有值跳转redirectUrl 没值跳转 /
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          this.$notify({ message: '手机号或验证码错误', duration: 700 })
        }
      }
    }
  }
}
</script>

<style scoped>
.btn-box {
  padding: 20px;
}
</style>
