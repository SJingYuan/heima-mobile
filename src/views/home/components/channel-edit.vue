<template>
  <div class="channel-edit">
    <!-- 我的 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 循环选项 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <span  @click="$emit('selectChannel', index)" :class="{red:index===activeIndex}" class="f12">{{item.name}}</span>
          <van-icon  @click="$emit('delChannel', item.id)"  v-if="index!==0&&editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'

export default {
  data () {
    return {
      editing: false, // 正在编辑状态，控制是否显示删除图标
      allChannels: [] // 接受全部频道数据
    }
  },
  props: {
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 频道数据赋值给频道
    }
  },
  computed: {
    // 可用频道
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels() // 调用组件放法
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
