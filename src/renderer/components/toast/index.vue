<template>
  <div class="toast" v-if="showToast"
    :class="showContent ?'fadein':'fadeout'">
    {{message}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      showToast: false,
      showContent: false,
      message: null
    }
  },
  methods: {
    show (msg, duration = 2000) {
      this.message = msg
      this.showToast = true
      this.showContent = true

      const timer = setTimeout(() => {
        this.showContent = false
        clearTimeout(timer)
      }, duration - 250)

      const timers = setTimeout(() => {
        this.showToast = false
        clearTimeout(timers)
      }, duration)
    }
  }
}
</script>

<style lang="less">
.toast {
  height: fit-content;
  width: fit-content;
  line-height: 20px;
  text-align: center;
  position: absolute;
  font-size: 16px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 1000!important;
  color: #ffffff;
  background: rgba(0, 0, 0, .7);
  padding: 10px;
  border-radius: 5px;
}
.fadein {
  animation: animate_in 0.25s;
}
.fadeout {
  animation: animate_out 0.25s;
  opacity: 0;
}
@keyframes animate_in {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
@keyframes animate_out {
  0% {
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
</style>
