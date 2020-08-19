// import Vue from 'vue'
import request from '@/common/request'
const GLOBAL_LANGUAGE = 'GLOBAL_LANGUAGE'
const GET_TOKEN = 'GET_TOKEN'
const FEED_BACK = 'FEED_BACK'

const state = {
  lang: null
}

const mutations = {
  [GLOBAL_LANGUAGE] (state, data) {
    state.lang = data
  }
}

const actions = {
  [GET_TOKEN] ({ commit, dispatch }, pa) {
    return request({
      method: 'POST',
      url: '/api/getToken',
      body: pa,
      raw: true
    })
  },
  async [FEED_BACK] (context, pa) {
    return request({
      method: 'POST',
      url: '/feedback/userFeedback',
      body: pa,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
