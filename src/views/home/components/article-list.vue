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
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <!-- 列表 -->
            <!-- 三张图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <!-- 作者信息 -->
                <span>{{item.aut_name}}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate | relTime }}</span>
                <span @click.stop="$emit('showMoreAction',item.art_id)" class="close" v-if="user.token">
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
import { mapState } from 'vuex'
import eventBus from '@/utils/eventbus'
export default {
  // 初始化函数
  created () {
    eventBus.$on('delArtiles', (artId, channelId) => {
      // 每个组件实例都会触发
      // 判断传递过来的频道是否等于自身的频道
      if (channelId === this.channel_id) {
        // 说明当前这个article-list实例就是我们要删除数据的实例
        const index = this.articles.findIndex(item => item.art_id.toString() === artId) // 通过id查询对应文章数据的下标
        if (index > -1) {
          // 从零开始大于负一
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        // 数据删光自动触发onload
        if (this.articles.length === 0) {
          this.onLoad() // 手动触发onload 给页面加数据
        }
      }
    })
  },
  computed: {
    ...mapState(['user']) // 映射到计算属性
  },
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
      await this.$sleep() // 人为控制请求时间
      const data = await getArticle({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      this.articles.push(...data.results) // 数据尾部追加
      this.upLoading = false
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 人为控制请求时间
      // 发送最新的时间戳
      const data = await getArticle({
        channel_id: this.channel_id,
        timestamp: Date.now() // 时间戳
      })
      // 手动关闭下拉刷新状态
      this.downLoading = false
      // 判断最新的时间戳能不能换来数据，能就替换数据。不能就提示没更新
      if (data.results.length) {
        // 有返回数据，将整个articles替换
        this.articles = data.results
        if (data.pre_timestamp) {
          // 下拉刷新获取新数据，又有历史时间戳
          this.finished = false // 重新换醒finshed
          this.timestamp = data.pre_timestamp // 记下历史时间戳
        }
        this.successText = `更让新了${data.results.length}条数据`
      } else {
        // 换不来提示
        this.successText = '当前已经是最新数据'
      }
      // setTimeout(() => {
      //   const arr = Array.from(Array(2), (value, index) => '追加' + index + 1)
      //   this.articles.unshift(...arr)
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
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
