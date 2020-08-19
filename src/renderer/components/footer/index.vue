<template>
  <div class="footer">
    <p>{{ADDRESS}}</p>
    <div class="version">
      <span>{{APP_CONFIG.AppVersion}}, </span>
      <span> {{lang.login.TBVersion}}: {{$electronTB._rtcEngine.getVersion().split('|')[0].split('(')[0]}}, </span>
      <span> {{lang.login.HMRVersion}}: {{$hummer._hummer.VERSION}}</span>
    </div>
  </div>
</template>

<script>
import {
  ADDRESS
} from '@/common/const'
import { APP_CONFIG } from '@/common/config'
import lang from '@/common/mixins/lang'

export default {
  data () {
    return {
      ADDRESS,
      APP_CONFIG
    }
  },
  mixins: [lang]
}
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  text-align: center;
  color: #333;
  padding: 20px 0;
  color: #BBBBBB;
  font-size: 12px;
  p {
    line-height: 20px;
    font-size: 12px;
    margin-bottom: 5px;
  }
}
</style>
