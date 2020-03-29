<template>
  <div class="container">
    <!-- 头部导航 -->
    <van-nav-bar @click-right="$router.push('/search')" title="黑马头条" right-text="搜索" fixed v-if="$route.path!=='/user'"></van-nav-bar>
    <!-- 二级路由容器 -->
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
    <!-- 缓存二级路由容器 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    </div>
    <!-- 底部标签栏 -->
    <van-tabbar route>
      <!-- router-link  to  -->
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
