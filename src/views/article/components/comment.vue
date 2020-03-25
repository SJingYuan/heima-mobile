<template>
  <div class="comment">
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate |relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
  <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit" class="submit" v-else slot="button">提交</span>
      </van-field>
          <!-- 回复 -->
    <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top"  v-for="item in  reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{ item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
    </div>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      loading: false, // 上拉加载中
      finished: false, // 全部加载完毕
      value: '', // 输入的内容
      submiting: false, // 控制提交中状态数据
      comments: [], // 评论数据
      offset: null, // 分页依据
      showReply: false, // 控制回复面板是否回复
      reply: {
        loading: false, // 评论的评论上拉加载中
        finished: false, // 评论的评论全部加载完毕
        offset: null,
        list: [],
        commentId: null
      }
    }
  },
  methods: { // 提交评论的方法
    async submit () {
      if (!this.value) return false // 表示如果当前评论内容为空就立刻返回
      this.submiting = true
      await this.$sleep() // 强制等待500 毫秒
      try {
        const data = await commentOrReply({
        // this.reply.commentId 存在 就要对 评论进行评论  否则传文章ID
          target: this.reply.commentId ? this.reply.commentId.toString() : this.$route.query.artId, // 要么是文章id, 要么是 评论id
          content: this.value, // 评论的内容
          art_id: this.reply.commentId ? this.$route.query.artId : null
        })
        if (this.reply.commentId) {
          // 对评论进行评论
          this.reply.list.unshift(data.new_obj)
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId.toString())
          comment && comment.reply_count++ // 如果找到了 就对回复数据加1
        } else {
          // 对文章进行评论
          this.comments.unshift(data.new_obj) // 文章评论
        }
        this.value = '' // 清空输入框
      } catch (error) {
        this.$snotify({ type: 'danger', message: '评论失败' })
      }
      // 最后去关闭 状态
      this.submiting = false // 关闭进度条
    },
    // 打开回复
    openReply (commentId) {
      this.showReply = true
      this.reply.commentId = commentId
      this.reply.list = [] // 清空原有的数据
      this.reply.offset = null // 重置回复的偏移量 因为每个评论的评论都是从第一页开始
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 主动打开加载状态 因为这个时候没有了自动的检查
      this.getReply() // 开始调用第一页的数据
    },
    async getReply () {
      const data = await getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false// 关闭加载状态
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    // 一级评论
    async  onLoad () {
      //  加载评论数据
      const data = await getComments({
        type: 'a', // 获取类型
        offset: this.offset, // 偏移量
        source: this.$route.query.artId // 获取文章的id
      })
      this.comments.push(...data.results) // 将数据添加到当前评论列表的尾部
      this.loading = false // 关闭正在上拉加载的状态
      this.finished = data.last_id === data.end_id // 如果当前页ID等于整个评论最后一个id 表示 我们已经请求万了所有的数据
      if (!this.finished) {
        this.offset = data.last_id // 将last_Id设置成下一页的请求依据
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
