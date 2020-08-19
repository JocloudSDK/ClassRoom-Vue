<template>
  <div class="TestStore">
    <button @click="init">init</button>
    <button @click="login">login</button>
    <button @click="join">join</button>
    <button @click="getUsers">getUsers</button>
    <button @click="init">init</button>
    <div>{{JSON.stringify(state)}}</div>
  </div>
</template>

<script>
import store from '../store/index'
import * as type from '../store/type'
import { mapState } from 'vuex'

export default {
  name: 'TestStore',
  computed: mapState({
    state: function (state) {
      return state
    }
  }),
  methods: {
    init () {
      store.dispatch({
        type: type.initialize,
        APPID: '123456',
        token: 'AAAAAgAAADptSstnAAgzMTU1NTQ0MwAAAAAAAAFzbGUG_QAnjQCVfmxEDCBu38OOUpEbwfA3joofGA'
      })
    },
    login () {
      store.dispatch({
        type: type.login,
        uid: '49827164',
        token: 'AAAAAgAAADptSstnAAgzMTU1NTQ0MwAAAAAAAAFzbGUG_QAnjQCVfmxEDCBu38OOUpEbwfA3joofGA'
      })
    },
    join () {
      store.dispatch({
        type: type.joinRoom,
        roomId: '123456'
      })
    },
    getUsers () {
      store.dispatch({
        type: type.getUserList
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
