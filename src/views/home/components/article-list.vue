<template>
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh :success-text="successText" v-model="downLoading" @refresh="onRefresh">
      <van-list
        finished-text="没有了"
        offset="200"
        v-model="upLoading"
        :finished="finished"
        @load="onLoad"
      >
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id">
            <!-- 列表 -->
            <!-- 三张图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">PullRefresh下拉刷新</h3>
                <!-- 三图 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图 -->
              <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->
              <div class="info_box">
                <!-- 作者信息 -->
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/articles'
export default {
  name: 'article-list',
  data () {
    return {
      successText: '',
      downLoading: false, // 下拉加载
      upLoading: false, // 是否上拉加载数据
      finished: false, // 加载是否完成
      articles: [], // 文章列表
      timestamp: null // 历史时间戳
    }
  },
  props: {
    channel_id: {
      required: true, // 要求改props必须传
      type: Number, // 必须传数字类型
      default: null // 默认值
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   this.articles.push(...arr)
      //   this.upLoading = false
      // }
      // setTimeout(() => (this.finished = true), 1000)
      const data = await getArticle({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      this.articles.push(data.results) // 数据尾部追加
      this.upLoading = false
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
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
 /user/channels
<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
