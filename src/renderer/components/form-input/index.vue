<template>
  <el-input
    v-model="cloneValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :show-password="showPassword"
    :suffix-icon="icon"
    :maxlength="maxlength"
    :minlength="minlength"
    v-on:keyup.enter.native="keyups"/>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    placeholder: String,
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    icon: String,
    maxlength: Number,
    minlength: Number
  },
  data () {
    return {
      cloneValue: this.value
    }
  },
  created () {
    this.cloneValue = this.value
  },
  watch: {
    cloneValue (v) {
      this.cloneValue = v
      this.$emit('input', v)
    },
    value (v) {
      this.cloneValue = v
    }
  },
  methods: {
    keyups (v) {
      this.$emit('keyup', v.keyCode)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
