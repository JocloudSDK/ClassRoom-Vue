import Vue from 'vue'
import { List } from 'immutable'
import { HummerManager } from '@/lib/rtm-client'
import { APPID } from '@/common/config'
import { WebThunderManager } from '@/lib/web-rtc-client'
import { ElectronThunderManager } from '@/lib/electron-rtc-client'
import LogFactory from '@/common/log'
import {
  each,
  omit,
  isEqual,
  cloneDeep,
  isEmpty
} from 'lodash'

const hummerManager = new HummerManager()
const webThunderManager = new WebThunderManager()
const electronThunderManager = new ElectronThunderManager()
Vue.prototype.$hummer = hummerManager
Vue.prototype.$webTB = webThunderManager
Vue.prototype.$electronTB = electronThunderManager

const state = {
  offline: false,
  connectState: null,
  roomId: '',
  appID: '',
  token: '',
  loading: false,
  uid: null,
  users: null,
  allUsers: null,
  teacher: null,
  musicState: false,
  enumAudioInputDevices: [],
  enumVideoDevices: [],
  audioDevicesValue: null,
  videoDevicesValue: null,
  LogFileName: 'ClassRoom-PC.log',
  loginMessage: null,
  log: null,
  rtm: {
    room: null,
    joined: false,
    logined: false
  },
  rtc: {
    joined: false,
    published: false
  },
  // Class State
  course: {
    teacherId: '',
    boardId: '',
    boardToken: '',
    courseState: 0,
    muteChat: 0,
    isRecording: false,
    recordId: '',
    recordingTime: 0,
    rid: '',
    roomName: '',
    roomType: 0,
    lockBoard: 0,
    roomId: '',
    screenId: '',
    screenToken: ''
  },
  messages: List()
}

const mutations = {
  initHummer (state, data) {
    state.hummer = data
  },
  initialize (state, payload = null) {
    state.appID = payload && payload.APPID
    state.token = payload && payload.token
  },
  joinRoom (state, payload = null) {
    state.roomId = payload && `${payload.type}${payload.roomId}`
    state.rtm.joined = true
  },
  leaveRoom (state, payload) {
    state.rtm.room = null
  },
  login (state, payload) {
    state.rtm.logined = true
  },
  logout (state, payload) {
    state.rtm.logined = false
    state.rtm.joined = false
  },
  getUserList (state, payload) {

  },
  getUserAttributes (state, payload) {

  },
  queryUsersOnlineStatus (state, payload) {

  },
  queryOnlineStatusForUser (state, payload) {

  },
  sendMessageToChannel (state, payload) {

  },
  sendMessageToUser (state, payload) {

  },
  modifyRoomAttributes (state, payload) {

  },
  getRoomAttributes (state, payload) {

  },
  loading (state, payload = false) {
    state.loading = payload.loading
  },
  updateUser (state, payload = null) {
    state.users = payload
  },
  updateUID (state, payload = null) {
    state.uid = payload
  },
  updateTeacher (state, payload = null) {
    state.teacher = payload
  },
  updateCourse (state, payload = null) {
    state.course.courseState = payload && payload.courseState
  },
  updateMusic (state, payload = false) {
    state.musicState = payload
  },
  enumAudioInputDevices (state, payload = []) {
    state.enumAudioInputDevices = payload
  },
  enumVideoDevices (state, payload = []) {
    state.enumVideoDevices = payload
  },
  audioInputDevicesValue (state, payload = null) {
    state.audioDevicesValue = payload
  },
  videoDevicesValue (state, payload = null) {
    state.videoDevicesValue = payload
  },
  updateOffline (state, payload = false) {
    state.offline = payload
  },
  updateConnectState (state, payload = null) {
    state.connectState = payload
  },
  uploadLog (state, reload = null) {
    state.log = reload
  },
  updateAllUsers (state, payload = null) {
    state.allUsers = payload
  },
  updateLoginMessage (state, reload = null) {
    state.loginMessage = reload
  }
}

const actions = {
  initHummer ({ commit }, pa) {
    commit('initHummer', hummerManager)
  },
  async initialize (context, payload) {
    hummerManager.createHummer(Number(APPID))
    // webThunderManager.init(Number(APPID))
    await electronThunderManager.initialize(APPID, 0)
    context.commit('initialize', { ...payload, APPID: APPID })
    const log = new LogFactory().New('localFile', {
      logFileName: state.LogFileName,
      logPrefix: '--- App: '
    })
    const i = log.logFileNameFull.lastIndexOf('/')
    const logPath = log.logFileNameFull.substring(0, i)
    console.log('logPath : ' + logPath, i)
    electronThunderManager.setLogFilePath(logPath)
    context.commit('uploadLog', log)
  },
  async joinRoom (context, payload) {
    hummerManager.createRTSInstance()
    hummerManager.createRoom('cn', `${payload.type}${payload.roomId}`)
    try {
      const data = await context.dispatch('getRoomAttributes', {
        roomId: `${payload.type}${payload.roomId}`
      })
      console.log('before login getRoomAttributes:', data)
      state.log.info('[store] before login getRoomAttributes:', data)
      if (data.rescode === 0) {
        let _isTeacher = false
        let isMe = false
        each(data.attributes, (item, key) => {
          if (JSON.parse(item).role === '1' && JSON.parse(item).uid !== state.uid) {
            _isTeacher = true
            return false
          } else if (JSON.parse(item).role === '1' && JSON.parse(item).uid === state.uid) {
            _isTeacher = true
            isMe = true
            return false
          }
        })
        if (_isTeacher && !isMe) {
          await context.dispatch('logout')
          return false
        }
      }
      const res = await hummerManager.join()
      const eres = await electronThunderManager.joinRoom({
        token: payload.token,
        roomName: `${payload.type}${payload.roomId}`,
        uid: payload.uid
      })
      context.commit('loading', { loading: false })
      if (res.rescode === 0 && eres === 0) {
        context.commit('joinRoom', payload)
        return res
      } else {
        return -1
      }
    } catch (err) {
      context.commit('loading', { loading: false })
      state.log.debug('[store] joinroom failed', err)
      return err
    }
  },
  async leaveRoom (context, payload) {
    if (!payload || !payload.dontLeaveHummer) {
      hummerManager.leave()
    }
    await electronThunderManager.leaveRoom()
    const res = await context.dispatch('logout')
    context.commit('updateTeacher')
    context.commit('joinRoom')
    context.commit('updateUser')
    context.commit('updateAllUsers')
    context.commit('updateCourse')
    context.commit('leaveRoom', payload)
    return res
  },
  async login (context, payload) {
    context.commit('loading', { loading: true })
    try {
      const res = await hummerManager.login('cn', String(payload.uid), payload.token)
      context.commit('login', payload)
      context.commit('loading', { loading: false })
      state.log.info('[store] login res:', res)
      return res
    } catch (err) {
      context.commit('loading', { loading: false })
      state.log.error('[store] login err:', err)
      return err
    }
  },
  async logout (context, payload) {
    const res = await hummerManager.logout()
    context.commit('logout', payload)
    return res
  },
  async getUserList (context, payload) {
    const res = await hummerManager.getMembers()
    const result = context.dispatch('getRoomAttributes')
    console.log('getRoomAttributes ' + JSON.stringify(result))
    console.log('getUserList ' + JSON.stringify(res))
  },
  getUserAttributes (context, payload) {
    return context.commit('getUserAttributes', payload)
  },
  queryUsersOnlineStatus (context, payload) {
    return context.commit('queryUsersOnlineStatus', payload)
  },
  queryOnlineStatusForUser (context, payload) {
    return context.commit('queryOnlineStatusForUser', payload)
  },
  async sendMessageToChannel (context, payload) {
    context.commit('sendMessageToChannel', payload)
    console.log('sendMessageToChannel params', {
      type: '100',
      ...payload
    })
    return await hummerManager.sendMessage({
      type: '100',
      ...payload
    })
  },
  sendMessageToUser (context, payload) {
    return hummerManager.sendMessageToUser({
      type: '100',
      content: hummerManager._hummer.Utify.encodeStringToUtf8Bytes(payload.content),
      receiver: payload.receiver
    })
  },
  modifyRoomAttributes (context, payload) {
    return context.commit('modifyRoomAttributes', payload)
  },
  modifyUserAttributes (context, payload) {
    switch (payload.type) {
      case 'delete':
        context.dispatch('deleteRoomAttributesByKeys', payload.params)
        break
      case 'add':
      case 'update':
        context.dispatch('addOrUpdateRoomAttributes', payload.params)
        break
      case 'set':
        context.dispatch('setRoomAttributes', payload.params)
        break
    }
  },
  async setRoomAttributes (context, payload) {
    return await hummerManager.setRoomAttributes(payload)
  },
  async getRoomAttributes (context, payload) {
    const res = await hummerManager.getRoomAttributes({
      regin: 'cn',
      roomId: (payload && payload.roomId) || state.roomId
    })
    console.log('getRoomAttributes res:', res)
    const obj = {}
    each(res.attributes, (v, k) => {
      obj[k] = typeof v === 'string' ? JSON.parse(v) : v
    })
    const data = JSON.parse(JSON.stringify(obj))
    await context.commit('updateAllUsers', data)
    const _attributes = !isEmpty(obj) && omit(cloneDeep(obj), [state.uid])
    if (isEqual(_attributes, omit(obj, [state.uid]))) {
      const _arr = []
      each(_attributes, item => {
        _arr.push(item)
      })
      context.commit('updateUser', _arr)
    }
    return res
  },
  async addOrUpdateRoomAttributes ({ commit }, payload) {
    return await hummerManager.addOrUpdateRoomAttributes(payload)
  },
  async deleteRoomAttributesByKeys ({ commit }, payload) {
    const res = await hummerManager.deleteRoomAttributesByKeys(payload)
    return res
  },
  async setPreviewCanvas ({ commit }, payload) {
    return await electronThunderManager.setPreviewCanvas(payload.view, payload.mode)
  },
  async cancelPreviewCanvas ({ commit }, payload) {
    return await electronThunderManager.cancelPreviewCanvas()
  },
  async startVideoPreview ({ commit }, payload) {
    return await electronThunderManager.startVideoPreview()
  },
  async stopVideoPreview ({ commit }, payload) {
    return await electronThunderManager.stopVideoPreview()
  },
  async stopLocalVideoStream ({ commit }, payload) {
    return await electronThunderManager.stopLocalVideoStream(payload)
  },
  async stopLocalAudioStream ({ commit }, payload) {
    const res = await electronThunderManager.stopLocalAudioStream(payload)
    return res
  },
  async setVideoCanvas ({ commit }, payload) {
    return await electronThunderManager.setVideoCanvas(payload.uid, payload.view, payload.mode)
  },
  async cancelVideoCanvas ({ commit }, payload) {
    return await electronThunderManager.cancelVideoCanvas(payload.uid)
  },
  async setAudioSourceType ({ commit }, payload) {
    return await electronThunderManager.setAudioSourceType(payload)
  },
  async startVideoDeviceCapture ({ commit }, payload) {
    return await electronThunderManager.startVideoDeviceCapture(payload)
  },
  async enumVideoDevices ({ commit }, payload) {
    const res = await electronThunderManager.enumVideoDevices()
    commit('enumVideoDevices', res)
    commit('videoDevicesValue', res[0].index)
    return res
  },
  async setAudioInputtingDevice ({ commit }, payload) {
    return await electronThunderManager.setAudioInputtingDevice(payload)
  },
  async enableCaptureVolumeIndication ({ commit }, payload) {
    return await electronThunderManager.enableCaptureVolumeIndication(500, 0, 0, 0)
  },
  async enumAudioInputDevices ({ commit }, payload) {
    const res = await electronThunderManager.enumAudioInputDevices()
    commit('enumAudioInputDevices', res)
    commit('audioInputDevicesValue', res[0].index)
    return res
  },
  async stopVideoDeviceCapture (context, payload) {
    return await electronThunderManager.stopVideoDeviceCapture()
  },
  async openAudioPlayer (context, payload) {
    const res = await electronThunderManager.openAudioPlayer(payload)
    return res
  },
  async setAudioPlayerLooping (context, payload) {
    const res = await electronThunderManager.setAudioPlayerLooping(payload)
    return res
  },
  async startAudioPlayer (context, payload) {
    const res = await electronThunderManager.startAudioPlayer()
    return res
  },
  async stopAudioPlayer (context, payload) {
    return await electronThunderManager.stopAudioPlayer()
  },
  async setVideoEncoderConfig (context, payload) {
    return await electronThunderManager.setVideoEncoderConfig(payload)
  },
  async startAudioInputDeviceTest (context, payload) {
    return await electronThunderManager.startAudioInputDeviceTest(payload)
  },
  async stopAudioInputDeviceTest (context, payload) {
    return await electronThunderManager.stopAudioInputDeviceTest()
  },
  async startVideoDeviceTest (context, payload) {
    return await electronThunderManager.startVideoDeviceTest(payload.index, payload.view)
  },
  async stopVideoDeviceTest (context, payload) {
    return await electronThunderManager.stopVideoDeviceTest()
  },
  async setAudioVolumeIndication (context, payload) {
    return await electronThunderManager.setAudioVolumeIndication(500, 0)
  },
  async setCanvasScaleMode (context, payload) {
    return await electronThunderManager.setCanvasScaleMode(payload)
  },
  async setPreviewCanvasScaleMode (context, payload) {
    return await electronThunderManager.setPreviewCanvasScaleMode(payload)
  }
}

export default {
  state,
  mutations,
  actions
}
