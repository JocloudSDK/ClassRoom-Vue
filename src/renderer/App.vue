<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import './assets/style/style.less';
#app {
  font-family: PingFangSC-Regular, PingFang SC, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: rgba(245,246,251,1);
  user-select: none;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
