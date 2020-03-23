<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-if="!q">
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toSearchREsult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'heima-history' // 作为历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: JSON.parse(localStorage.getItem(key) || '[]')
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 跳到搜索结果
    toSearchREsult (text) {
      // this.$router.push('/search/result?q=' + text)
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 清空历史记录
    async  clear () {
      try {
        // console.log('ni')
        await this.$dlalog.confirm({ title: '提示', message: '你确定要删除嘛' })
        this.historyList = []
        localStorage.setItem(key, '[]')
      } catch (error) {

      }
    },
    onSearch () {
      if (!this.q) return
      this.historyList.push(this.q)
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
  // created () {
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
