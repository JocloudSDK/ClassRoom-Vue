<template>
  <transition name="fade" mode="out-in">

    <div class="warpper">
      <Header />

      <div class="electron-wrapper">
        <router-view></router-view>
      </div>

      <template v-if="$route.name === 'Login'">
        <Footer />
      </template>
    </div>
  </transition>
</template>

<script>

import Header from '@/components/header'
import Footer from '@/components/footer'
export default {
  data () {
    return {}
  },
  components: {
    Header,
    Footer
  },
  created () {
    window.t = this
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.warpper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .electron-wrapper {
    flex: 1;
    min-height: 0;
    margin-top: 1px;
  }
}
</style>
