<template>
  <div class="t-view">
    <div v-loading="loading" class="canvas" ref="canvas" v-show="info.video === '1'"></div>
    <img v-if="info.video === '0'" class="default-img" src="@/assets/img/logo/video-logo.png" alt="">
    <div class="info info-bottom" v-if="info">
      <span>{{info.nickname}}</span>
      <div class="btn">
        <template>
          <Voice v-if="!$store.state.room.musicState && info.audio === '1'" @closeVoice="toggleVoice('off')" :voice="score" />
          <img v-else @click="toggleVoice('on')" src="@/assets/img/class/speak-enable.png" alt="">
        </template>
        <template>
          <img v-if="info.video === '1'" @click="toggleCamera('off')" src="@/assets/img/class/camera.png" alt="">
          <img @click="toggleCamera('on')" v-else src="@/assets/img/class/camera-enable.png" alt="">
        </template>
      </div>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script>
import {
  cloneDeep
} from 'lodash'
import {
  VIDEO_PUBLISH_MODE
} from '@/common/const'
export default {
  props: {
    info: Object,
    lang: Object,
    score: Number
  },
  data () {
    return {
      loading: false,
      VIDEO_PUBLISH_MODE
    }
  },
  components: {
    Toast: () => import('@/components/toast'),
    Voice: () => import('@/components/voice')
  },
  methods: {
    async initPreview (isStop) {
      const res = await this.$store.dispatch('startVideoPreview')
      console.log('[CLASSROOM] startVideoPreview: ', res)
      const data = await this.$store.dispatch('stopLocalVideoStream', isStop)
      console.log('[CLASSROOM] stopLocalVideoStream: ', data)
    },
    toggleVoice (type) {
      switch (type) {
        case 'on':
          this.openVoice()
          break
        case 'off':
          this.closeVoice()
          break
      }
    },
    toggleCamera (type) {
      switch (type) {
        case 'on':
          this.openCamera()
          break
        case 'off':
          this.closeCamera()
          break
      }
    },
    initRoomAttributeData (audio, video) {
      const data = cloneDeep(this.$store.state.room.teacher)
      data.audio = audio
      data.video = video
      return data
    },
    async openCamera () {
      if (!this.$store.state.room.course.courseState) {
        this.$toast(this.lang.class.StartClassTips)
      } else {
        this.loading = true
        await this.$store.dispatch('setVideoEncoderConfig', {
          playType: 1,
          publishMode: VIDEO_PUBLISH_MODE
        })
        await this.$store.dispatch('setPreviewCanvas', {
          view: this.$refs.canvas,
          mode: 2
        })
        this.$store.dispatch('startVideoPreview')
        this.$store.dispatch('stopLocalVideoStream', false)
        this.$store.dispatch('startVideoDeviceCapture', this.$store.state.room.videoDevicesValue)
        const params = this.initRoomAttributeData(this.$store.state.room.teacher.audio, '1')
        const obj = {}
        obj[this.$store.state.room.uid] = JSON.stringify(params)
        this.$store.dispatch('addOrUpdateRoomAttributes', obj)
        this.loading = false
      }
    },
    closeCamera () {
      this.$store.dispatch('cancelPreviewCanvas')
      this.$store.dispatch('stopVideoPreview')
      this.$store.dispatch('stopLocalVideoStream', true)
      this.$store.dispatch('stopVideoDeviceCapture')
      const params = this.initRoomAttributeData(this.$store.state.room.teacher.audio, '0')
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    async openVoice () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      if (this.$store.state.room.musicState) {
        this.$store.commit('updateMusic', false)
        this.$store.dispatch('stopAudioPlayer')
        this.$store.dispatch('stopLocalAudioStream', true)
      }
      this.$store.dispatch('setAudioInputtingDevice', this.$store.state.room.audioDevicesValue)
      this.$store.dispatch('stopLocalAudioStream', false)
      this.$store.dispatch('enableCaptureVolumeIndication')
      const params = this.initRoomAttributeData('1', this.$store.state.room.teacher.video)
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    closeVoice () {
      this.$store.dispatch('stopLocalAudioStream', true)
      const params = this.initRoomAttributeData('0', this.$store.state.room.teacher.video)
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    }
  }
}
</script>

<style lang="less" scoped>
.t-view {
  height: 202px;
  background: rgba(0, 0, 0, .1);
  position: relative;
  .default-img {
    height: 60px;
    width: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .canvas {
    height: 100%;
    width: 100%;
  }
  .info {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 38px;
    background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%);
    color: #fff;
    padding: 0 9px;
    line-height: 38px;
    display: flex;
    justify-content: space-between;
    width: 289px;
    .btn {
      display: flex;
    }
    span {
      font-size: 16px;
    }
    img {
      height: 29px;
      width: 29px;
      margin-left: 6px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
</style>
