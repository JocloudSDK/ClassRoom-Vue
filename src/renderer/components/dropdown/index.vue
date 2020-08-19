<template>
  <el-dropdown @command="handleCommand" :trigger="trigger">

    <span class="el-dropdown-link">
      {{showText}} <i class="el-icon-arrow-down el-icon--right"></i>
    </span>

    <el-dropdown-menu slot="dropdown">
      <template v-for="item in options">
        <el-dropdown-item :key="item.key" :command="item.key">{{item.label}}</el-dropdown-item>
      </template>
    </el-dropdown-menu>

  </el-dropdown>
</template>

<script>
export default {
  props: {
    options: Array,
    showText: {
      type: String,
      default () {
        return this.options[0].label
      }
    },
    /**
     * click hover
     */
    trigger: {
      type: String,
      default: 'click'
    }
  },
  data () {
    return {}
  },
  methods: {
    handleCommand (c) {
      this.$emit('input', c)
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown {
  cursor: pointer;
}
</style>
