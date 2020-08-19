<template>
  <el-form-item
    ref="formItem"
    :prop="prop"
    class="custom-form">
    <div
      class="label-wrapper"
      v-if="label"
      :class="[required ? 'is-required' : '']">
      {{label}}
    </div>

    <div class="value-wrapper"
    :class="showError ? 'is-error' : ''">
      <template v-if="type !== 'select'">
        <el-input
          :type="type"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          v-model="cloneValue"
          :minlength="minlength"
          :maxlength="maxlength"
          @input="updateValue"
          :clearable="clearable">
        </el-input>
      </template>

      <template v-if="type === 'select'">
        <el-select
          v-model="cloneValue"
          :placeholder="placeholder"
          @change="updateValue">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.label"
            :value="item.key"
            >
          </el-option>
        </el-select>
      </template>

      <transition name="error">
        <div v-if="showError" class="el-form-item__error">{{showError}}</div>
      </transition>
    </div>
  </el-form-item>
</template>

<script>
import {
  isInteger
} from 'lodash'
export default {
  props: {
    value: [String, Number, Array],
    prop: String,
    label: String,
    pattern: String,
    required: {
      type: Boolean,
      default: false
    },
    validate: String,
    // input select textarea ...
    type: {
      type: String,
      default: 'input'
    },
    maxlength: Number,
    minlength: Number,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    options: {
      type: Array,
      default: () => []
    },
    errorTips: String,
    minError: String
  },
  data () {
    return {
      cloneValue: this.value,
      validatorStatus: false
    }
  },
  components: {
    // FormInput: () => import('@/components/form-input')
  },
  watch: {
    value (v) {
      this.cloneVlue = v
    }
  },
  computed: {
    showError () {
      return (this.validatorStatus || this.minStatus) &&
        (
          (this.required && this.validator(this.required, this.cloneValue)) ||
          (this.validate && this.validator(this.validate, this.cloneValue))
        )
    }
  },
  methods: {
    updateValue (v) {
      if (this.pattern) {
        if (this.pattern === 'number') {
          const value = v
          const reg = /^\d+$/
          if (!reg.test(v)) this.cloneValue = value.substr(0, value.length - 1)
        }
      }
      !this.validatorStatus && (this.validatorStatus = true)

      if (this.minlength && v) {
        !this.minStatus && (this.minStatus = true)
      }
      this.$emit('input', v)
    },
    checkValue () {
      this.validatorStatus = true
      return this.showError
    },
    checkErrorValue () {
      return this.cloneValue && this.showError
    },
    validator (type, value) {
      if (this.minlength) {
        if (this.cloneValue) {
          if (this.cloneValue.length < this.minlength) {
            return this.minError
          }
        }
      }
      if (typeof type === 'boolean') {
        return value ? '' : this.errorTips
      } else {
        switch (type) {
          case 'isInteger':
            return isInteger(value) ? '' : this.errorTips
        }
      }
    }
  }
}
</script>

<style lang="less">
.el-form-item {
  margin-bottom: 10px;
}
.el-textarea__inner {
  resize: none;
  height: 95px;
}
.label-wrapper {
  text-align: left;
  color: #666666;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-shadow: 0px 8px 35px rgba(158,164,221,0.17);
  padding-bottom: 9px;
}
.value-wrapper {
  .el-input {
    .el-input__inner {
      border: 1px solid #E5E6E5!important;
    }
    .el-input__suffix {
      .el-input__icon {
        color: #2E62FD;
        font-weight: 600;
      }
    }
  }
  &.is-error {
    .el-input {
      .el-input__inner {
        border: 1px solid red!important;
      }
    }
  }
  .el-form-item__error {
    right: 0!important;
    left: auto;
  }
  .el-select {
    width: 100%;
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
