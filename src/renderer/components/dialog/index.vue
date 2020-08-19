<template>
  <el-dialog
    :title="title"
    :visible.sync="clonevisible"
    :width="width"
    :show-close="showClose"
    center
    :close-on-click-modal="closeOnClickModal"
    :custom-class="customClass">

    <slot></slot>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{cancelText}}</el-button>
      <el-button type="primary" @click="comfirm">{{confirmText}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {
  cloneDeep
} from 'lodash'
export default {
  props: {
    title: String,
    width: {
      type: String,
      default: '360px'
    },
    visible: {
      type: Boolean,
      default: false
    },
    needFooter: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    cancelText: String,
    confirmText: String,
    type: String,
    customClass: String
  },
  data () {
    return {
      clonevisible: cloneDeep(this.visible)
    }
  },
  watch: {
    visible (v) {
      this.clonevisible = v
    }
  },
  methods: {
    close () {
      this.clonevisible = false
    },
    cancel () {
      this.$emit('close', this.type)
    },
    comfirm () {
      this.$emit('confirm', this.type)
    }
  }
}
</script>

<style lang="less">
.el-dialog {
  .el-dialog__header {
    padding-top: 30px;
    .el-dialog__title {
      font-size: 20px;
      font-weight: 600;
      color: rgba(51,51,51,1);
      line-height: 24px;
    }
  }
}
.dialog-footer {
  .el-button {
    padding: 12px 45px;
    border-radius: 20px;
    color: #666;
    font-weight: 600;
    +.el-button {
      margin-left: 20px;
    }
    border-color: #E5E6E5;
    &.el-button--primary {
      background:rgba(46,98,253,1);
      color: #fff;
      border: none;
    }
  }
}
.dialog-setting {
  .el-dialog__header, .el-dialog__body {
    padding: 0!important;
  }
}
</style>
