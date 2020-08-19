<template>
  <div class="voice">
    <img src="../../assets/img/voice/voice-0.png" alt="">

    <div class="dynamic">
      <div v-for="item in voice" :key="item"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      voice: []
    }
  },
  created () {
    this.initVoice()
  },
  methods: {
    initVoice () {
      this.voice = Array(24).fill(null)
    }
  }
}
</script>

<style lang="less" scoped>
.voice {
  display: flex;
  align-items: center;
  padding: 10px 0 0;
  img {
    height: 29px;
    width: 29px;
  }
  .dynamic {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    height: 20px;
    div {
      background: rgb(238, 238, 238);
      border-radius: 2px;
      width: 4px;
    }
  }
}
</style>
