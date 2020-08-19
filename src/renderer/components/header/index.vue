<template>
  <div class="header"
    :class="type==='login'?'':'classes'">

    <div class="flex logo">

      <img @click="handleLogo" v-if="type === 'login'" src="@/assets/img/logo/logo.png" alt="">

      <template v-else>
        <img src="@/assets/img/logo/logo.png" alt="">
        <span class="split"></span>
        <div class="classname">
          {{classType === 'SClass' ? lang.class.JoSmallClass : lang.class.JoPrivateClass}}
          {{$route.params.id}}
        </div>
      </template>

    </div>

    <div class="flex setting" >
      <div class="btn" v-if="type === 'class'">
        <custom-Button
          :btnText="lang.class.StartClass"
          @click-btn="startClass"
          className="theme-btn"
          v-if="!$store.state.room.course.courseState">
        </custom-button>

        <div class="classing" v-else>
          <div class="class-time">
            <img src="@/assets/img/class/recording.png" alt="">
            <span>{{lang.class.ClassTime}}</span>
            <span class="time">{{classingTime}}</span>
          </div>
          <custom-Button
            :btnText="lang.class.OverClass"
            className="theme-btn"
            @click-btn="overClass"
            >
          </custom-button>
        </div>
      </div>

      <div class="lang" v-if="type === 'login'">

        <drop-down
          :options="options"
          :showText="showText"
          @input="changeLang">
        </drop-down>

      </div>

      <div v-else class="set">

        <custom-Button
          :btnText="lang.class.Feedback"
          type="plain"
          @click-btn="showDialog('feedback')">
        </custom-button>

        <custom-Button
          :btnText="lang.class.Setting"
          type="plain"
          @click-btn="showDialog('setting')"
          v-if="!$store.state.room.course.courseState">
        </custom-button>

        <custom-Button
          :btnText="lang.class.Logout"
          type="plain"
          @click-btn="showDialog('logout')">
        </custom-button>

        <Network :score="network" :height="27"></Network>
      </div>
    </div>

    <Dialog
      :visible="isShowDialog"
      :title="title"
      :type="dialogType"
      :cancelText="cancelText"
      :confirmText="confirmText"
      @close="closeDialog"
      @confirm="confirm"
      :customClass="`dialog-${dialogType}`">

      <template v-if="dialogType === 'feedback'">
        <feed-back ref="feedback" :show="isShowDialog"></feed-back>
      </template>

      <template v-if="dialogType === 'setting'">
        <setting ref="setting" :show="isShowDialog"></setting>
      </template>

    </Dialog>

  </div>
</template>

<script>
import lang from '@/common/mixins/lang'
import DropDown from '@/components/dropdown'
import Network from '@/components/network'
import CustomButton from '@/components/custom-button'
import Dialog from '@/components/dialog'
import mixins from '@/pages/classroom/com/mixins'
import Setting from '@/components/setting'
import {
  LANGUAGE_TYPE,
  STORAGE,
  REQUEST_URL
} from '@/common/const'
import {
  each,
  cloneDeep
} from 'lodash'
import { APP_CONFIG } from '@/common/config'
import bus from '@/bus'
const remote = window.require('electron').remote
const fs = window.require('fs')
const zlib = window.require('zlib')
export default {
  props: {
    classNameId: Number
  },
  data () {
    return {
      fs,
      options: [],
      language: null,
      showText: null,
      type: 'login',
      isShowDialog: false,
      title: null,
      cancelText: null,
      confirmText: null,
      dialogType: null,
      isStart: false,
      classingTime: '00 : 00',
      seconds: 0,
      minutes: 0,
      hours: 0,
      classType: null,
      log: null,
      network: 0,
      LogFileName: 'ClassRoom-PC.log',
      showTool: false
    }
  },
  components: {
    DropDown,
    Network,
    CustomButton,
    Dialog,
    Setting,
    FeedBack: () => import('@/components/feedback')
  },
  mixins: [lang, mixins],
  created () {
    window.h = this
    this.initLangOption()
    this.initLang()
    this.type = this.$route.name === 'Login' ? 'login' : 'class'
    bus.$on('onTeacherNetWorkQuality', data => {
      this.onTeacherNetWorkQuality(data)
    })
    bus.$on('leaveRoom', () => {
      clearInterval(this.timer)
    })
  },
  watch: {
    '$route.name' (v) {
      if (v === 'Login') {
        this.type = 'login'
      } else {
        this.type = 'class'
      }
    },
    '$route.params.type' (v) {
      this.classType = v
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    handleLogo () {
      const win = remote.getCurrentWindow()
      if (this.showTool) {
        win.webContents.openDevTools({ mode: 'right' })
      } else {
        win.webContents.closeDevTools({ mode: 'right' })
      }
      this.showTool = !this.showTool
    },
    onTeacherNetWorkQuality (data) {
      this.network = data
    },
    initLangOption () {
      each(LANGUAGE_TYPE, (value, key) => {
        const obj = {}
        obj.label = value
        obj.key = key.toLowerCase()
        this.options.push(obj)
      })
    },
    initLang () {
      const l = this.$storage.get(STORAGE.KEY_LANGUAGE) || this.$store.state.global.lang || 'zh'
      this.language = this.$store.state.global.lang || 'zh'

      this.showText = this.options.filter(item => item.key === l)[0].label
    },
    changeLang (data) {
      this.$storage.set(STORAGE.KEY_LANGUAGE, data)
      this.showText = this.options.filter(item => item.key === data)[0].label
      this.$store.commit('GLOBAL_LANGUAGE', data)
    },
    closeDialog (type) {
      this.dialogType = type

      if (type === 'feedback') {
        this.isShowDialog = false
      }
      if (type === 'setting') {
        this.freshSetting()
      }
    },
    showDialog (type) {
      this.dialogType = type
      if (type !== 'logout') {
        this.isShowDialog = true
      }

      switch (type) {
        case 'feedback':
          this.initFeedbackData()
          break
        case 'setting':
          this.initSettingData()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    confirm (type) {
      switch (type) {
        case 'feedback':
          this.confirmFeedback()
          break
        case 'setting':
          this.confirmSetting()
          break
      }
    },
    confirmFeedback () {
      const node = this.$refs.feedback
      const validator = this.validator(node.$refs.form)
      if (!validator) {
        // todo
        const newZipFile = this.$store.state.room.log._fullName + '.zip'
        const concat = node.$refs.form.$children[0].cloneValue
        const description = node.$refs.form.$children[1].cloneValue
        const gzip = zlib.createGzip()
        const source = fs.createReadStream(this.$store.state.room.log._fullName)
        const destination = fs.createWriteStream(newZipFile)
        source.pipe(gzip).pipe(destination)
        this.postLog(newZipFile, this.$store.state.room.uid, concat, description)
        this.$message({
          message: this.lang.feedback.FeedbackSuccess,
          type: 'success'
        })
        this.closeDialog('feedback')
      }
    },
    confirmSetting () {
      this.$store.dispatch('stopVideoDeviceTest')
      this.$store.dispatch('stopVideoDeviceCapture')
      this.$store.dispatch('stopLocalVideoStream', true)
      this.isShowDialog = false
    },
    freshSetting () {
      this.$store.commit('videoDevicesValue', this.$store.state.room.enumVideoDevices[0].index)
      this.$store.commit('audioInputDevicesValue', this.$store.state.room.enumAudioInputDevices[0].index)
    },
    logout () {
      if (this.$store.state.room.course.courseState) {
        this.$confirm(this.lang.exit.ExitText, this.lang.exit.ExitTip, {
          confirmButtonText: this.lang.exit.Confirm,
          cancelButtonText: this.lang.exit.Cancel,
          customClass: 'yy-confirm',
          showClose: false,
          callback: (action) => {
            if (action === 'confirm') {
              this.overClass()
            }
          }
        })
        return false
      }
      this.exitRoom()
    },
    async exitRoom () {
      // teacher deletes owner channel attributes
      if (this.$store.state.room.musicState) {
        this.$store.dispatch('stopAudioPlayer')
        this.$store.commit('updateMusic', false)
      }
      await this.$store.dispatch('deleteRoomAttributesByKeys', [this.$store.state.room.uid])
      await this.overSendroommessage()
      this.$store.dispatch('leaveRoom')
      this.$router.push({
        name: 'Login'
      })
    },
    clearData () {
      this.title = null
      this.cancelText = null
      this.confirmText = null
    },
    clearTimer () {
      this.seconds = 0
      this.minutes = 0
      this.hours = 0
      this.classingTime = '00 : 00'
      clearInterval(this.timer)
    },
    initSettingData () {
      this.clearData()
      this.cancelText = this.lang.setting.Fresh
      this.confirmText = this.lang.setting.Confirm
    },
    async postLog (logFileName, uid, contact, text) {
      // const result = { success: false, error: null }
      const responseObj = {
        appId: 'ClassRoom-Vue',
        sign: '',
        data: {
          reportType: 'UFB',
          guid: '123456',
          productVer: APP_CONFIG.AppVersion,
          uid: uid,
          contactInfo: contact || '',
          osVer: process.env.NODE_PLATFORM,
          phoneType: 'Electron',
          feedback: text || ''
        }
      }
      const formData = new FormData()
      const buffer = fs.readFileSync(logFileName)
      formData.append('nyy', JSON.stringify(responseObj))
      formData.append('file', new Blob([buffer]), logFileName)
      formData.append('file', logFileName)
      this.$axios.post(`${REQUEST_URL.FEEDBACK}userFeedback`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    initFeedbackData () {
      this.clearData()
      this.title = this.lang.feedback.Feedback
      this.cancelText = this.lang.feedback.Cancel
      this.confirmText = this.lang.feedback.Confirm
    },
    startClass () {
      this.$store.commit('updateCourse', {
        courseState: 1
      })
      this.timer = setInterval(this.startComputedTime, 1000)
    },
    overClass () {
      this.$store.commit('updateCourse', {
        courseState: 0
      })
      if (!this.$store.state.room.musicState) {
        this.$store.dispatch('stopLocalAudioStream', true)
        this.$store.dispatch('stopVideoDeviceCapture')
      }
      this.$store.dispatch('stopLocalVideoStream', true)
      this.clearTimer()
      this.$store.commit('changePPTMode', true)
      const params = cloneDeep(this.$store.state.room.teacher)
      params.audio = '0'
      params.video = '0'
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    async overSendroommessage () {
      const message = {
        msg_content: '',
        msg_time: Date.now() / 1000,
        msg_nickname: this.$store.state.room.teacher.nickname,
        msg_type: 2
      }
      const data = this.buildCommand('message', null, message)

      console.log('sendMessage params', data)
      await this.$store.dispatch('sendMessageToChannel', {
        content: this.$hummer._hummer.Utify.encodeStringToUtf8Bytes(data)
      })
    },
    startComputedTime () {
      this.seconds += 1
      if (this.seconds >= 60) {
        this.seconds = 0
        this.minutes = this.minutes + 1
      }

      if (this.minutes >= 60) {
        this.minutes = 0
        this.hours = this.hours + 1
      }
      this.classingTime = `${this.minutes < 10 ? `0${this.minutes}` : this.minutes} : ${this.seconds < 10 ? `0${this.seconds}` : this.seconds}`
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0px 1px 0px 0px rgba(229, 229, 229, 1);
  &.classes {
    color: #333333;
    .logo {
      .split {
        width: 1px;
        height: 14px;
        background: rgba(224, 224, 224, 1);
        display: inline-block;
        margin: 0 10px 0 6px;
      }
      img {
        height: 24px;
        width: auto;
        margin-top: -6px;
      }
      .classname {
        margin-left: 15px;
        color: #333;
        font-size: 16px;
      }
    }
    .class {
      span {

      }
    }
  }
  .flex {
    flex: 1;
    &.class {
      .btn {
        text-align: center;
      }
    }
  }
  .classing {
    display: flex;
    justify-content: center;
    align-items: center;
    .class-time {
      margin-right: 10px;
      img {
        margin-right: 10px;
        vertical-align: text-top;
      }
      span {
        margin-right: 10px;
        &.time {
          width: 60px;
          display: inline-block;
        }
      }
    }
  }
  .logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      height: 36px;
      width: auto;
    }
  }
  .setting {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .set {
      display: flex;
      align-items: center;
      .net-qualiy {
        padding-left: 15px;
      }
      .el-button--plain {
        background: rgba(255, 255, 255, .2);
      }
    }
  }
}
</style>
