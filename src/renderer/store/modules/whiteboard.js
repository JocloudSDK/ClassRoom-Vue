import { WhiteWebSdk, DeviceType } from 'white-web-sdk'
import { UserCursor } from '@netless/cursor-adapter'
import request from '@/common/request'
import bus from '@/bus'
import { NETLESSSDKTOKEN } from '@/common/config'
const NETLESS_GET_TOKEN = 'NETLESS_GET_TOKEN'
const NETLESS_ENTER_ROOM = 'NETLESS_ENTER_ROOM'
const NETLESS_JOIN_ROOM = 'NETLESS_JOIN_ROOM'
const NETLESS_CHANGE_PPT_MODE = 'NETLESS_CHANGE_PPT_MODE'

const client = new WhiteWebSdk({
  deviceType: DeviceType.Surface,
  // handToolKey: " ",
  loggerOptions: {
    disableReportLog: true,
    reportLevelMask: 'debug',
    printLevelMask: 'debug'
  }
})

const state = {
  uuid: '',
  loading: false,
  joined: false,
  scenes: [],
  currentScenePath: '',
  currentHeight: 0,
  currentWidth: 0,
  dirs: [],
  zoomRadio: 0,
  scale: 1,
  room: null,
  recording: false,
  startTime: 0,
  endTime: 0,

  totalPage: 0,
  currentPage: 0,
  type: '',
  isShowColorPicker: false,
  PPTMode: true
}

const mutations = {
  Loading (state, data) {
    state.loading = data
  },
  initUUID (state, data) {
    state.uuid = data
  },
  joinRoom (state, data) {
    state.joined = data
  },
  changePPTMode (state, data) {
    state.PPTMode = data
  },
  changeZoomScale (state, data) {
    state.scale = data
  },
  isShowColorPicker (state, data) {
    state.isShowColorPicker = data
  }
}

const actions = {
  async [NETLESS_GET_TOKEN] ({ commit, dispatch }, pa) {
    const result = await request({
      method: 'POST',
      url: '/netless_api/room?token=' + NETLESSSDKTOKEN,
      body: pa
    })
    console.log(result)
    commit('initUUID', result.msg.room.uuid)
    return result
  },
  async [NETLESS_ENTER_ROOM] ({ commit, dispatch }, pa) {
    commit('Loading', true)
    const result = await request({
      method: 'POST',
      url: '/netless_api/room/join?token=' + NETLESSSDKTOKEN + '&uuid=' + state.uuid,
      body: pa
    })
    console.log(result)
    commit('Loading', false)
    return result
  },
  async [NETLESS_JOIN_ROOM] ({ commit, dispatch }, payload) {
    commit('Loading', true)
    const cursorAdapter = new UserCursor()
    const room = await client.joinRoom({
      uuid: state.uuid,
      roomToken: NETLESSSDKTOKEN,
      cursorAdapter: cursorAdapter
    }, {
      onRoomStateChanged: modifyState => {
        if (modifyState.zoomScale) {
          commit('changeZoomScale', modifyState.zoomScale)
        }
        if (modifyState.roomMembers) {
          cursorAdapter.setColorAndAppliance(modifyState.roomMembers)
        }
      }
    })
    bus.$emit('chang_board_uuid', state.uuid)
    commit('joinRoom', { joined: true })
    console.log(room.deviceType, room)
    commit('Loading', false)
    return room
  },
  [NETLESS_CHANGE_PPT_MODE] ({ commit, dispatch }, payload) {
    commit('changePPTMode', !state.PPTMode)
  }
}

export default {
  state,
  mutations,
  actions
}
