<template>
  <div class="voice" :style="`height: ${height}px;width: ${width}px;`" @click="closeVoice">
    <img v-if="voice === 0" src="@/assets/img/class/speak-novoice.png" alt="">
    <img v-if="voice === 1" src="@/assets/img/voice/voice-1.png" alt="">
    <img v-if="voice === 2" src="@/assets/img/voice/voice-2.png" alt="">
    <img v-if="voice === 3" src="@/assets/img/voice/voice-3.png" alt="">
    <img v-if="voice === 4" src="@/assets/img/voice/voice-4.png" alt="">
    <img v-if="voice === 5" src="@/assets/img/voice/voice-5.png" alt="">
  </div>
</template>

<script>
export default {
  props: {
    voice: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 29
    },
    width: {
      type: Number,
      default: 29
    }
  },
  methods: {
    closeVoice () {
      this.$emit('closeVoice')
    }
  }
}
</script>

<style lang="less">
.voice img {
  height: 100%;
  width: 100%;
}
</style>
