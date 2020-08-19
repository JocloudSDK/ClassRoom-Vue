<template>
  <el-button
    class="cs-button"
    :class="className"
    :type="type"
    :icon="icon"
    :size="size"
    @click="clickBtn"
    :round="round">
    {{btnText}}
  </el-button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    btnText: String,
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    size: {
      type: String,
      default: 'medium'
    },
    round: {
      type: Boolean,
      default: false
    },
    className: String
  },
  methods: {
    clickBtn () {
      this.$emit('click-btn')
    }
  }
}
</script>

<style lang="less" scoped>
.cs-button {
  &:active {
    opacity: 0.7;
  }
  &.el-button {
    padding: 6px 12px;
    margin-left: 16px;
    line-height: 22px;
    color: #666666;
    font-size: 16px;
  }
  &.theme-btn {
    background: #2E62FD;
    border-radius: 8px;
    color: #fff;
  }
  &.login-btn {
    background: linear-gradient(270deg,rgba(91,155,255,1) 0%,rgba(46,98,253,1) 100%);
    box-shadow: 0px 8px 35px 0px rgba(158,164,221,0.17),0px 5px 13px 0px rgba(225,232,255,1);
    border-radius: 6px;
    color: #fff;
    margin-left: 0;
  }
  &.el-button--plain {
    color: #999;
    border-radius: 8px;
    line-height: 22px;
    border: 1px solid rgba(232,232,232,1);
  }
  &.height40 {
    padding: 8px 10px;
  }
}
</style>
