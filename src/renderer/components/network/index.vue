<template>
  <div class="net-qualiy" :style="`height:${height}px;width:${width}px`">
    <img v-if="score == 0" src="../../assets/img/network/quality_0.png" alt="">
    <img v-else-if="score == 1" src="../../assets/img/network/quality_1.png" alt="">
    <img v-else-if="score == 2" src="../../assets/img/network/quality_2.png" alt="">
    <img v-else-if="score == 3" src="../../assets/img/network/quality_3.png" alt="">
    <img v-else-if="score == 4" src="../../assets/img/network/quality_4.png" alt="">
    <img v-else-if="score == 5" src="../../assets/img/network/quality_5.png" alt="">
    <img v-else-if="score == 6" src="../../assets/img/network/quality_6.png" alt="">
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 16
    },
    width: {
      type: Number,
      default: 40
    }
  }
}
</script>

<style lang="less" scoped>
.net-qualiy {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 100%;
    width: 100%;
  }
}
</style>
