<template>
  <div class="student">
    <div class="student-list">
      <template v-for="(item, key) in students">
        <div class="list-item" :key="key">
          <span class="nick">{{item.nickname}}</span>

          <div class="btns">
            <template>
              <img @click="toggleWhiteBoard('off', item)" v-if="item.grant_board === '1'" src="@/assets/img/class/whiteboard.png" alt="">
              <img @click="toggleWhiteBoard('on', item)" v-else src="@/assets/img/class/whiteboard-enable.png" alt="">
            </template>
            <template>
              <img @click="toggleMute('off', item)" v-if="item.mute === '1'" src="@/assets/img/class/chat.png" alt="">
              <img @click="toggleMute('on', item)" v-else src="@/assets/img/class/chat-enable.png" alt="">
            </template>
          </div>
        </div>
      </template>
    </div>

    <div class="controls" v-if="$route.params.type !== 'OClass'">
      <custom-button
        v-if="$store.state.room.teacher.class_mute === '1'"
        :btnText="lang.class.ChatDisable"
        type="plain"
        className="height40"
        @click-btn="chatEnable"/>

      <custom-button
        v-else
        :btnText="lang.class.ChatEnable"
        className="theme-btn height40"
        @click-btn="chatDisable"/>
    </div>

    <toast ref="toast"></toast>
  </div>
</template>

<script>
import CustomButton from '@/components/custom-button'
// import Network from '@/components/network'
import mixins from './mixins'
import {
  cloneDeep
} from 'lodash'
export default {
  props: {
    lang: Object,
    students: [Object, Array]
  },
  data () {
    return {}
  },
  components: {
    CustomButton,
    // Network,
    Toast: () => import('@/components/toast')
  },
  mixins: [mixins],
  created () {},
  methods: {
    async chatDisable () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      const params = cloneDeep(this.$store.state.room.teacher)
      params.class_mute = '1'
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      const res = await this.$store.dispatch('addOrUpdateRoomAttributes', obj)
      console.log('[student] res', res)
      if (res.rescode === 0) {
        this.$toast(this.lang.class.ChatEnableTips)
      }
    },
    async chatEnable () {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      const params = cloneDeep(this.$store.state.room.teacher)
      params.class_mute = '0'
      const obj = {}
      obj[this.$store.state.room.uid] = JSON.stringify(params)
      const res = await this.$store.dispatch('addOrUpdateRoomAttributes', obj)
      console.log('[student] res', res)
      if (res.rescode === 0) {
        this.$toast(this.lang.class.ChatDisableTips)
      }
    },
    async toggleWhiteBoard (type, item) {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      const params = this.buildCommand('grant_board', type === 'on' ? '1' : '0', null)
      await this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    },
    toggleMute (type, item) {
      if (!this.$store.state.room.course.courseState) {
        return this.$toast(this.lang.class.StartClassTips)
      }
      const params = this.buildCommand('mute', type === 'on' ? '1' : '0', null)
      this.$store.dispatch('sendMessageToUser', {
        content: params,
        receiver: item.uid
      })
    }
  }
}
</script>

<style lang="less" scoped>
.student {
  height: 100%;
  overflow: auto;
  position: relative;
  .list-item {
    display: flex;
    margin-left: 13px;
    align-items: center;
    border-bottom: 1px solid #F1F1F1;
    padding: 5px 0;
    .nick {
      flex: 1;
      min-width: 0;
      font-size: 16px;
      color: #666;
      line-height: 22px;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btns {
      display: flex;
      max-width: 176px;
      align-items: center;
      justify-content: flex-end;
      img {
        height: 40px;
        width: 40px;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
        }
      }
      &.disable {
        img {
          // cursor: not-allowed;
        }
      }
      .net-qualiy {
        margin-right: 10px;
      }
    }
  }
  .controls {
    position: fixed;
    bottom: 12px;
    right: 9px;
    &.disable {
      button {
        // cursor: not-allowed;
      }
    }
  }
}
</style>
