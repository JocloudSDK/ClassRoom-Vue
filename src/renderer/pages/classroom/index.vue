<template>
  <div class="classroom">
    <div class="c-left">

      <template v-if="$route.params.type === 'SClass'">
        <div class="s-class-wrap">
          <small-class :users="users" ref="usersView" :voices="studensVoices"></small-class>
        </div>
      </template>

      <template v-if="$route.params.type === 'OClass'">
        <div class="o2o-class" v-if="users && users.length">
          <s-view ref="o2oView" :item="users[0]" :voices="studensVoices"/>
        </div>
      </template>

      <div class="c-white-board">
        <white-board></white-board>
      </div>
    </div>

    <div class="c-right">
      <teacher-view :info="teacher" :lang="lang" :score="teacherScore"></teacher-view>

      <Tabs :users="users"></Tabs>
    </div>
  </div>
</template>

<script>
import lang from '@/common/mixins/lang'
import mixins from './com/mixins'
import {
  STORAGE
} from '@/common/const'
import {
  get,
  cloneDeep,
  each
} from 'lodash'
import bus from '@/bus'
export default {
  name: 'Classroom',
  data () {
    return {
      each,
      teacherScore: 0,
      o2oInfo: {},
      studensVoices: [],
      teacherInfo: {
        nickname: '老师',
        audio: true,
        score: 1,
        video: true
      }
    }
  },
  created () {
    window.b = this
    this.$store.dispatch('setAudioVolumeIndication')
    this.getUserList()
    this.listeners()
    this.initDevices()
    if (!this.$store.state.room.roomId) {
      this.$router.push({
        name: 'Login'
      })
    }
    if (this.users && this.users.length) {
      this.initCanvas()
    }
  },
  computed: {
    users () {
      return cloneDeep(this.$store.state.room.users)
    },
    teacher () {
      const uid = this.$store.state.room.uid || this.$storage.get(STORAGE.KEY_UID)
      this.$store.commit('updateTeacher', get(this.$store.state.room.allUsers, uid, {}))
      return get(this.$store.state.room.allUsers, uid, {})
    }
  },
  watch: {
    'users.length' (v) {
      this.initCanvas()
    },
    '$store.state.room.roomId' (v) {
      if (!v) {
        this.$router.push({
          name: 'Login'
        })
      }
    }
  },
  mixins: [lang, mixins],
  components: {
    SmallClass: () => import('./smallClass'),
    Tabs: () => import('./tabs'),
    TeacherView: () => import('./teacher-view'),
    WhiteBoard: () => import('@/components/whiteBoard'),
    SView: () => import('./com/s-view')
  },
  destroyed () {
    this.$electronTB.offAll()
    this.$hummer.offAll()
  },
  methods: {
    listeners () {
      bus.$on('openCamera', data => {
        this.toggleCamera('open', data)
      })
      bus.$on('closeCamera', data => {
        this.toggleCamera('close', data)
      })
      bus.$on('chang_board_uuid', data => {
        this.changeAttribute(data)
      })
      this.$hummer.on('ConnectionStateChanged', data => {
        this.onConnectionStateChanged(data)
      })
      this.$hummer.on('RoomAttributesAddedOrUpdated', data => {
        // this.onRoomAttributesAddedOrUpdated(data)
        console.log('[CLASS] onRoomAttributesAddedOrUpdated', data)
        if (data && data.attributes) {
          this.$store.dispatch('getRoomAttributes')
        }
      })
      this.$hummer.on('RoomAttributesDeleted', data => {
        this.onRoomAttributesDeleted(data)
      })
      this.$hummer.on('MemberJoined', data => {
        this.onMemberJoined(data)
      })
      this.$hummer.on('MemberLeft', data => {
        this.onMemberLeft(data)
      })
      this.$hummer.on('RoomMemberOffline', () => {
        this.onRoomMemberOffline()
      })
      this.$electronTB.on('onRemoteAudioStopped', data => {
        this.onRemoteAudioStopped(data)
      })
      this.$electronTB.on('onRemoteVideoStopped', data => {
        this.onRemoteVideoStopped(data)
      })
      this.$electronTB.on('onCaptureVolumeIndication', (totalVolume, cpt, micVolume) => {
        this.onCaptureVolumeIndication(totalVolume, cpt, micVolume)
      })
      this.$electronTB.on('onNetworkQuality', data => {
        this.onNetworkQuality(data)
      })
      this.$electronTB.on('onPlayVolumeIndication', data => {
        this.onPlayVolumeIndication(data)
      })
    },
    initCanvas () {
      each(this.users, (item, index) => {
        this.$nextTick(() => {
          if (this.$route.params.type === 'SClass') {
            const timer = setTimeout(() => {
              this.setVideoCanvas(item.uid, this.$refs.usersView.$children[index].$refs[`canvas-${item.uid}`])
              clearTimeout(timer)
            }, 200)
          } else if (this.$route.params.type === 'OClass') {
            const timer = setTimeout(() => {
              this.setVideoCanvas(item.uid, this.$refs.o2oView.$refs[`canvas-${item.uid}`])
              clearTimeout(timer)
            }, 200)
          }
        })
      })
    },
    onConnectionStateChanged (data) {
      if (this.$store.state.room.connectState) {
        if (this.$store.state.room.connectState === 'RECONNECTING') {
          if (data.state === 'CONNECTED') {
            // logout
            this.$store.dispatch('deleteRoomAttributesByKeys', [this.$store.state.room.uid])
            this.$store.dispatch('leaveRoom', {
              dontLeaveHummer: true
            })
            bus.$on('leaveRoom')
            this.$router.push({
              name: 'Login'
            })
            return
          }
        }
      }
      this.$store.commit('updateConnectState', data.state)
      console.log('[LAYOUT] ConnectionStateChanged', data)
    },
    changeAttribute (data) {
      const params = cloneDeep(this.$store.state.room.teacher)
      params.board_uuid = data
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    async initDevices () {
      await this.$store.dispatch('enumAudioInputDevices')
      await this.$store.dispatch('enumVideoDevices')
    },
    async setVideoCanvas (uid, view) {
      await this.$store.dispatch('setVideoCanvas', {
        uid: uid,
        view: view,
        mode: 2
      })
    },
    async onRoomAttributesAddedOrUpdated (data) {
      console.log('[CLASS] onRoomAttributesAddedOrUpdated', data)
      if (data && data.attributes) {
        await this.$store.dispatch('getRoomAttributes')
      }
    },
    onPlayVolumeIndication (data) {
      this.studensVoices = []
      each(data.speakers, item => {
        if (item.uid === this.$store.state.room.uid) {
          // me
        } else {
          const obj = {}
          obj.uid = item.uid
          obj.volumn = parseInt(item.volume / 20)
          this.studensVoices.push(obj)
        }
      })
    },
    onNetworkQuality (data) {
      console.log('[CLASS] onNetworkQuality', data)
      if (data.uid === '0' || data.uid === this.$store.state.room.uid) { // me
        bus.$emit('onTeacherNetWorkQuality', data.txQuality)
      } else {
        if (this.users && this.users.length) {
          const allUsers = this.$store.state.room.allUsers
          let _return = false
          each(this.users, item => {
            if (allUsers[item.uid] && (allUsers[item.uid].uid === item.uid)) {
              if (item.uid === data.uid) {
                item.score = data.txQuality || data.rxQuality
              }
              _return = true
              return true
            }
          })
          if (_return) {
            this.$store.commit('updateUser', this.users)
          }
        }
      }
    },
    async onRoomAttributesDeleted (data) {
      console.log('[CLASS] onRoomAttributesDeleted', data)
      await this.$store.dispatch('getRoomAttributes')
    },
    onMemberJoined (data) {
      console.log('[CLASS] onMemberJoined', data)
    },
    onMemberLeft (data) {
      console.log('[CLASS] onMemberLeft', data)
      each(data.uids, async item => {
        if (this.$store.state.room.allUsers[item]) {
          await this.$store.dispatch('deleteRoomAttributesByKeys', [this.$store.state.room.allUsers[item].uid])
          await this.$store.dispatch('getRoomAttributes')
        }
      })
    },
    onRoomMemberOffline () {
      console.log('[CLASS] onRoomMemberOffline')
      this.$store.commit('updateOffline', true)
    },
    onRemoteAudioStopped (data) {
      console.log('[CLASS] onRemoteAudioStopped：', data)
    },
    onRemoteVideoStopped (data) {
      console.log('[CLASS] onRemoteVideoStopped', data)
    },
    onCaptureVolumeIndication (totalVolume, cpt, micVolume) {
      console.log('[CLASS] onCaptureVolumeIndication', totalVolume, cpt, micVolume)
      if (micVolume < 0) micVolume = 0
      if (micVolume > 100) micVolume = 100
      this.teacherScore = parseInt(micVolume / 20)
    },
    async getUserList () {
      await this.$store.dispatch('getUserList')
    },
    toggleCamera (type, item) {
      console.log('[CLASS] toggleCamera', type, item)
      const params = this.buildCommand('option_video', type === 'open' ? '1' : '0', null)
      this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    },
    toggleVoice (type, item) {
      console.log('[CLASS] toggleVoice', type, item)
      const params = this.buildCommand('option_audio', type === 'open' ? '1' : '0', null)
      this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    }
  }
}
</script>

<style lang="less" scoped>
.classroom {
  height: 100%;
  width: 100%;
  display: flex;
  background: #fff;
  .c-right {
    width: 307px;
    border-left: 1px solid #dcdcdc;
    display: flex;
    flex-direction: column;
    height: 100%;
    .t-view {
      height: 202px;
    }
    .class-tabs {
      flex: 1;
      min-height: 0;
    }
  }
  .c-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    position: relative;
    .c-white-board {
      flex: 1;
      min-height: 0;
    }
    .s-class-wrap {
      height: 202px;
      border-bottom: 1px solid #dcdcdc;
    }
    .white-board {
      flex: 1;
      min-height: 0;
    }
    .o2o-class {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 9999;
    }
  }
}
</style>
