<template>
  <div class="container">
    <van-tabs v-model="activeIndex">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <ArticleList @showMoreAction="openMoreAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
    </span>
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <moreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
    </van-popup>
     <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <ChannelEdit @delChannel="delChannel" :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels, delChannel } from '../../api/channels'
import moreAction from './components/moreAction'
import { disLikeArticle, reportArticle } from '@/api/articles'
import eventbus from '../../utils/eventbus' // 公共事件處理器
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home',
  components: {
    ArticleList,
    moreAction,
    ChannelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null, // 接受点击的文章id
      activeIndex: 0,
      showChannelEdit: false
    }
  },
  methods: {
    async delChannel (id) {
      try {
        await delChannel(id)
        const index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)
      } catch (error) {
        this.$snotify({ message: '删除频道失败' })
      }
    },
    // selectChannel (id) {
    //   const index = this.channels.findIndex(item => item.id === id) // 获取索引
    //   this.activeIndex = index // // 将tabs激活标签切换到对应的标签下
    //   this.showChannelEdit = false // 关闭弹层
    // },
    selectChannel (index) {
      this.activeIndex = index // // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭弹层
    },
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    async getMyChannels () {
      const data = await getMyChannels() // 接收结果
      this.channels = data.channels // 赋值给data的channels
    },
    // 对文章不感兴趣
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣的文章接口
      try {
        operateType === 'dislike'
          ? await disLikeArticle({ target: this.articleId })
          : await reportArticle({ target: this.articleId, type })
        // await下方的逻辑 是 resolve(成功)之后 的
        this.$snotify({
          type: 'success',
          message: '操作成功'
        })

        eventbus.$emit(
          'delArtiles',
          this.articleId,
          this.channels[this.activeIndex].id
        )
        this.showMoreAction = false
      } catch (error) {
        // 默认是红色
        this.$snotify({
          message: '操作失败'
        })
      }
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
  .van-action-sheet {
    max-height: 100%;
    height: 100%;
    .van-action-sheet__header {
      background: #3296fa;
      color: #fff;
      .van-icon-close {
        color: #fff;
      }
    }
  }
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
