import Vue from 'vue'
import Vuex from 'vuex'
import logger from 'vuex/dist/logger'

import app from './modules/app'
import global from './modules/global'
import room from './modules/room'
import whiteboard from './modules/whiteboard'

console.log('当前平台:', process.env.NODE_PLATFORM)

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    global,
    room,
    whiteboard
  },
  strict: debug,
  plugins: debug ? [logger()] : []
})
