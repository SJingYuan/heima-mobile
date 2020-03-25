<template>
  <div class="container">
    <van-nav-bar @click-right="saveUser" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell :value="user.name" @click="showName= true" is-link title="名称" />
      <van-cell @click="showGender=true" is-link title="性别" :value="user.gender===0?'男':'女'" />
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell @click="openChangeFile" is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹昵称 -->
    <van-popup :close-on-click-overlay="false"  v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="this.nameMessage" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <van-button @click="btnName" size="normal" block type="info">确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthDay=false"
          @confirm="confirmDate"
      />
    </van-popup>
        <!-- 文件选择控件 -->
    <input ref="myFile" @change="upload()" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updateImg, saveUserInfo } from '@/api/user'
export default {
  data () {
    return {
      showBirthDay: false, // 是否显示日期弹层
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false, // 是否显示性别选择的弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      nameMessage: '',
      user: {
        name: '', // 昵称
        gender: 1, // 性别
        birthday: '', // 生日
        photo: '' // 头像
      }
    }
  },
  methods: {
    // 保存用户信息
    async saveUser () {
      try {
        await saveUserInfo(this.user)
        this.$snotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$snotify({ message: '保存失败' })
      }
    },
    // 选择文件
    openChangeFile () {
      this.$refs.myFile.click()
    },
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 生日
    showDate () {
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false
    },

    // 性别
    selectItem (item, index) {
      this.user.gender = index
      this.showGender = false
    },
    // 用户名
    btnName () {
      if (this.user.name.length < 1 || this.user.length > 7) {
        this.nameMessage = '用户昵称不符合1-7的长度要求'
        return
      }
      this.nameMessage = ''
      this.showName = false
    },
    // 编辑头像
    async upload () {
      const data = new FormData()
      data.append('photo', this.$refs.myFile[0])
      const result = await updateImg(data)
      this.user.photo = result.photo
      this.showPhoto = false
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
