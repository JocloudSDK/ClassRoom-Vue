<template>
  <div class="view-scope">
    <div class="canvas" :ref="`canvas-${item.uid}`" :data-refs="`canvas-${item.nickname}`"></div>

    <div class="info info-bottom">
      <div class="info-l">
        <Network :score="item.score" :height="14" :width="21"/>
        <span>{{item.nickname}}</span>
      </div>
      <div class="info-r">
        <img @click="openVoice" v-if="item.audio==='0'" src="@/assets/img/class/speak-enable.png" alt="">
        <Voice v-else :voice="find(cloneVoices, {uid: item.uid}) && find(cloneVoices, {uid: item.uid}).volumn || 0" @closeVoice="closeVoice"/>
        <template>
          <img @click="closeCamera" v-if="item.video === '1'" src="@/assets/img/class/camera.png" alt="">
          <img @click="openCamera" v-else src="@/assets/img/class/camera-enable.png" alt="">
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Network from '@/components/network'
import Voice from '@/components/voice'
import lang from '@/common/mixins/lang'
import mixins from './mixins'
// import bus from '@/bus'
import {
  find
} from 'lodash'
export default {
  props: {
    item: [Object, Array],
    voices: Array
  },
  data () {
    return {
      find,
      cloneVoices: []
    }
  },
  components: {
    Network,
    Voice
  },
  created () {
    this.cloneVoices = this.voices
  },
  watch: {
    voices (v) {
      this.cloneVoices = v
    },
    item: {
      deep: true,
      handler (v) {}
    }
  },
  mixins: [lang, mixins],
  methods: {
    getCurrentVoice (uid) {
      const _voice = this.cloneVoices.filter(item => item.uid === uid)
      if (_voice) return _voice.volume
      return 0
    },
    closeCamera () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      console.log('[s-view]', 'closeCamera', this.item)
      this.toggleCamera('close', this.item)
    },
    openCamera () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      console.log('[s-view]', 'openCamera', this.item)
      this.toggleCamera('open', this.item)
    },
    closeVoice () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      console.log('[s-view]', 'closeStudentVoice', this.item)
      this.toggleVoice('close', this.item)
    },
    openVoice () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      console.log('[s-view]', 'openStudentVoice', this.item)
      this.toggleVoice('open', this.item)
    },
    toggleVoice (type, item) {
      console.log('[CLASS] toggleVoice', type, item)
      const params = this.buildCommand('option_audio', type === 'open' ? '1' : '0', null)
      this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    },
    toggleCamera (type, item) {
      console.log('[CLASS] toggleCamera', type, item)
      const params = this.buildCommand('option_video', type === 'open' ? '1' : '0', null)
      this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    }
  }
}
</script>

<style lang="less" scoped>
.view-scope {
  width: 307px;
  height: 195px;
  background: rgba(0, 0, 0, .2);
  position: relative;
  display: inline-block;
  margin-right: 1px;
  overflow: hidden;
  .canvas {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .info {
    position: absolute;
    width: 94%;
    height: 30px;
    line-height: 30px;
    left: 0;
    color: #fff;
    padding: 6px 3%;
  }
  .info-top {
    top: 0;
    display: flex;
    justify-content: space-between;
  }
  .info-bottom {
    bottom: 0;
    height: 30px;
    display: flex;
    justify-content: space-between;
    background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%);
    .info-l {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
        // width: 64px;
        // display: inline-block;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        font-size: 16px;
      }
    }
    .info-r {
      display: flex;
      &.disable {
        img, .voice {
          cursor: not-allowed;
        }
      }
      img {
        height: 29px;
        width: 29px;
      }
    }
  }
}
</style>
