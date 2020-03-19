<template>
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh :success-text="successText" v-model="downLoading" @refresh='onRefresh'>
      <van-list
        finished-text="没有了"
        offset="200"
        v-model="upLoading"
        :finished="finished"
        @load="onLoad"
      >
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item" :value="'啦啦啦'+item" title="内容"></van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      successText: '',
      downLoading: false, // 下拉加载
      upLoading: false, // 是否上拉加载数据
      finished: false, // 加载是否完成
      articles: []
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        this.articles.push(...arr)
        this.upLoading = false
      }
      // setTimeout(() => (this.finished = true), 1000)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(Array(2), (value, index) => '追加' + index + 1)
        this.articles.unshift(...arr)
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style>
</style>
