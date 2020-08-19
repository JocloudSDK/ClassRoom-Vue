<template>
  <div class="feedback">
    <el-form ref="form">
      <!-- <div class="current-version">
        {{lang.feedback.CurrentVersion}}: {{APP_CONFIG.AppVersion}}
      </div> -->

      <custom-form
        v-model="feedback.concat"
        :placeholder="lang.feedback.EmailPlaceholder"
        :label="lang.feedback.Email"
        prop="concat">
      </custom-form>

      <custom-form
        v-model="feedback.description"
        type="textarea"
        required
        :placeholder="lang.feedback.DescriptionPlaceholder"
        :label="lang.feedback.Description"
        prop="description"
        :errorTips="lang.feedback.DescriptionBlankTips">
      </custom-form>

    </el-form>
  </div>
</template>

<script>
import lang from '@/common/mixins/lang'
import CustomForm from '@/components/form'
import {
  APP_CONFIG
} from '@/common/config'
import {
  cloneDeep
} from 'lodash'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      APP_CONFIG,
      data: {
        concat: null,
        description: null
      },
      feedback: null
    }
  },
  mixins: [lang],
  components: {
    CustomForm
  },
  watch: {
    show (v) {
      if (!v) {
        this.feedback = cloneDeep(this.data)
      }
    }
  },
  created () {
    this.feedback = cloneDeep(this.data)
  }
}
</script>

<style lang="less">
.feedback {
  padding: 0 5px;
  .custom-form {
    margin-bottom: 26px;
    &:last-child {
      margin-bottom: 0;
    }
    .label-wrapper {
      font-size: 14px;
      font-weight: 500;
      color: rgba(51,51,51,1);
      line-height: 16px;
      padding-bottom: 10px;
    }
  }
}
.current-version {
  text-align: left;
  color: #333333;
  font-weight: 500;
  font-size: 14px;
}
</style>
