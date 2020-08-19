<template>
  <el-select
    v-model="cloneVlue"
    :placeholder="placeholder"
    @change="change"
    :class="type?type:''">

    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.label"
      :value="item.key">
    </el-option>

  </el-select>
</template>

<script>
export default {
  props: {
    value: [String, Number, Array, Object, Date],
    options: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: String,
    type: String
  },
  data () {
    return {
      cloneVlue: this.value
    }
  },
  watch: {
    value (v) {
      this.cloneVlue = v
    }
  },
  methods: {
    change (v) {
      this.$emit('input', v)
    }
  }
}
</script>

<style lang="less">
.el-select {
  // #E5E6E5
  .el-input__suffix {
    .el-input__icon {
      color: #2E62FD;
      font-weight: 600;
    }
  }
  .el-input__inner {
    border-color: #E5E6E5;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    font-weight: 500;
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    line-height: 40px;
    height: 40px;
    text-align: center!important;
  }
  .el-select-dropdown__item.selected {
    background: rgba(242,245,255,1);
    color: #2E62FD;
    font-size: 15px;
  }
}
</style>
