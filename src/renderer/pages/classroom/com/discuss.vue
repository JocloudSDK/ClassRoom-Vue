<template>
  <div class="discuss">
    <div class="tips">
      {{lang.class.DiscussTips}}{{lang.class.DiscussWelcomTips}}{{lang.login.ClassTypeOptions[$route.params.type]}}
    </div>
    <div class="message" ref="message">
      <template v-for="(item, index) in messageLists">
        <message-list :lang="lang" :key="index" :item="item"></message-list>
      </template>

    </div>
    <div class="textarea">
      <custom-input
        v-model="messageText"
        :placeholder="lang.class.SendTextPlaceholder"
        @keyup="keyup">
      </custom-input>
      <custom-button
        :btnText="lang.class.SendText"
        @click-btn="sendMessage"
        className="theme-btn"
        >
      </custom-button>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/form-input'
import CustomButton from '@/components/custom-button'
import MessageList from './message-list'
import moment from 'moment'
import {
  cloneDeep,
  each
} from 'lodash'
import {
  STORAGE
} from '@/common/const'
import mixins from './mixins'
export default {
  props: {
    lang: Object
  },
  data () {
    return {
      moment,
      each,
      messageText: null,
      userId: null,
      messageLists: [],
      l: null
    }
  },
  components: {
    CustomInput,
    CustomButton,
    MessageList
  },
  mixins: [mixins],
  created () {
    this.listeners()
    this.userId = this.$store.state.room.uid || this.$storage.get(STORAGE.KEY_UID)
    this.l = this.$storage.get(STORAGE.KEY_LANGUAGE) || this.$store.state.global.lang
  },
  mounted () {
    this.initMessagePosition()
  },
  updated () {
    this.initMessagePosition()
  },
  methods: {
    keyup (v) {
      if (v === 13) {
        this.sendMessage()
      }
    },
    listeners () {
      this.$hummer.on('RoomMessage', data => {
        this.onRoomMessage(data)
      })
    },
    onRoomMessage (data) {
      const message = JSON.parse(this.$hummer._hummer.Utify.decodeUtf8BytesToString(data.message.data))
      console.log('[discuss] onRoomMessage', data, message)
      if (data.fromUid === String(Number(this.userId))) {
        if (message.jsonValue.msg_type === 0) {
          this.messageLists.push({
            uid: this.userId,
            message: message.jsonValue.msg_content,
            type: 'teacher',
            time: moment(message.jsonValue.msg_time * 1000).format('HH:mm'),
            nickname: this.$store.state.room.teacher.nickname,
            msg_type: message.jsonValue.msg_type
          })
        }
      } else {
        this.messageLists.push({
          uid: data.fromUid,
          message: message.jsonValue.msg_type
            ? message.jsonValue.msg_type === 1
              ? `${message.jsonValue.msg_nickname} ${this.lang.class.EnterRoom}`
              : `${message.jsonValue.msg_nickname} ${this.lang.class.LeaveRoom}`
            : message.jsonValue.msg_content,
          type: message.jsonValue.msg_type ? 'system' : 'student',
          time: moment(message.jsonValue.msg_time * 1000).format('HH:mm'),
          nickname: message.jsonValue.msg_nickname,
          msg_type: message.jsonValue.msg_type
        })
      }
    },
    initMessagePosition () {
      this.$refs.message.scrollTop = this.$refs.message.scrollHeight
    },
    sendMessage () {
      if (!this.messageText) return
      const message = {
        msg_content: cloneDeep(this.messageText),
        msg_time: Date.now() / 1000,
        msg_nickname: this.$store.state.room.teacher.nickname,
        msg_type: 0
      }
      const data = this.buildCommand('message', null, message)

      this.messageText = null
      console.log('sendMessage params', data)
      this.$store.dispatch('sendMessageToChannel', {
        content: this.$hummer._hummer.Utify.encodeStringToUtf8Bytes(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.discuss {
  display: flex;
  flex-direction: column;
  height: 100%;
  .tips {
    background: rgb(245, 245, 245);
    color: #999999;
    font-size: 14px;
    padding-left: 11px;
    line-height: 40px;
  }
  .message {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .textarea {
    height: 40px;
    display: flex;
    margin: 15px 2px 12px 9px;
  }
}
</style>
