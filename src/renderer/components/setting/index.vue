<template>
  <div class="settings">
    <div class="view" ref="canvas"></div>

    <div class="info">
      <div class="label">
        <div class="name">
          {{lang.setting.Microphone}}
        </div>

        <custom-select
          :options="micOptions"
          v-model="mic"
          type="set-select"
          @input="changeMIC">
        </custom-select>

        <!-- <voice /> -->
      </div>

      <div class="label">
        <div class="name">
          {{lang.setting.Camera}}
        </div>

        <custom-select
          :options="cameraOptions"
          v-model="camera"
          type="set-select"
          @input="changeVIDEO">
        </custom-select>

      </div>
    </div>
  </div>
</template>

<script>
import {
  each,
  cloneDeep
} from 'lodash'
import lang from '@/common/mixins/lang'
import CustomSelect from '@/components/form-select'
// import Voice from './voice'
import {
  VIDEO_PUBLISH_MODE
} from '@/common/const'
import {
  plateform
} from '@/common/systemInfo'
export default {
  props: {
    show: Boolean
  },
  mixins: [lang],
  data () {
    return {
      plateform,
      mic: null,
      camera: null,
      micOptions: [],
      cameraOptions: []
    }
  },
  components: {
    CustomSelect
    // Voice
  },
  created () {
    this.initMicOptions()
    this.initCameraOptions()
    this.mic = this.$store.state.room.audioDevicesValue
    this.camera = this.$store.state.room.videoDevicesValue
    this.$electronTB.on('onInputVolume', data => {
      this.onInputVolume(data)
    })
  },
  watch: {
    show (v) {
      this.$nextTick(() => {
        this.initPreview()
      })
    },
    mics (v) {
      this.mic = v
    },
    cameras (v) {
      this.camera = v
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initPreview()
    })
  },
  computed: {
    mics () {
      return this.$store.state.room.audioDevicesValue
    },
    cameras () {
      return this.$store.state.room.videoDevicesValue
    }
  },
  methods: {
    onInputVolume (data) {},
    async initPreview () {
      await this.$store.dispatch('setVideoEncoderConfig', {
        playType: 1,
        publishMode: VIDEO_PUBLISH_MODE
      })
      await this.startVideoDeviceTest()
      await this.$store.dispatch('setPreviewCanvasScaleMode', 2)
      this.$store.dispatch('stopLocalAudioStream', true)
      this.$store.dispatch('stopLocalVideoStream', true)
    },
    async startVideoDeviceTest () {
      await this.$store.dispatch('startVideoDeviceTest', {
        index: this.$store.state.room.videoDevicesValue,
        view: this.$refs.canvas
      })
    },
    changeMIC (v) {
      this.$store.commit('audioInputDevicesValue', v)
    },
    changeVIDEO (v) {
      this.$store.commit('videoDevicesValue', v)
      this.startVideoDeviceTest()
    },
    initMicOptions () {
      const _options = []
      each(this.$store.state.room.enumAudioInputDevices, (item, key) => {
        const obj = {}
        obj.key = item.index
        obj.label = window.process.platform === 'darwin' ? item.name : item.desc
        _options.push(obj)
      })
      this.micOptions = cloneDeep(_options)
    },
    initCameraOptions () {
      const _options = []
      each(this.$store.state.room.enumVideoDevices, (item, key) => {
        const obj = {}
        obj.key = item.index
        obj.label = item.name
        _options.push(obj)
      })
      this.cameraOptions = cloneDeep(_options)
    }
  }
}
</script>

<style lang="less" scoped>
.settings {
  .view {
    height: 214px;
    width: 100%;
    background: red;
  }
  .info {
    padding: 20px 30px 0;
    .label {
      margin-bottom: 10px;
      .name {
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        color: rgb(51, 51, 51);
        margin-bottom: 10px;
      }
      .el-select {
        width: 100%;
        .el-input__inner {
          // background-color: rgba(46, 98, 253, .1)!important;
        }
      }
    }
  }
}
</style>
