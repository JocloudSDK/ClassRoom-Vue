<template>
  <div class="course-ware">
    <div class="tips" v-if="!pptLists.length">
      {{lang.class.CoursewareTips}}
    </div>

    <div class="warm-audio">
      <div class="audio-item">
        <span>{{lang.class.WakeMusic}}</span>
        <img v-if="!$store.state.room.musicState"
          src="@/assets/img/class/play.png" alt=""
          @click="startMusic">
        <img v-else src="@/assets/img/class/stop.png" alt=""
          @click="stopMusic">
      </div>
    </div>

    <div class="ppt">

      <template v-for="(item, index) in pptLists">
        <div :key="index" class="ppt-wrap"
          :class="active === index ? 'active wave' : ''"
          @click="checkPPT(item, index, $event)">
          <img :src="item.url" alt="">
          <div class="page">
            P{{index + 1}}
          </div>

          <div v-show="clickIndex === index" ref="wave" class="wave" :class="clickIndex === index ? 'ac-wave' : ''"></div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import {
  PPT,
  WARM_AUDIO
} from '@/common/const'
import bus from '@/bus'
import {
  cloneDeep
} from 'lodash'
export default {
  props: {
    lang: Object
  },
  data () {
    return {
      PPT,
      musicStart: false,
      pptLists: PPT,
      active: 0,
      clickIndex: null,
      hoverIndex: null
    }
  },
  created () {
    bus.$on('change_PPT', data => {
      this.active = data
    })
  },
  methods: {
    async startMusic () {
      this.musicStart = true
      this.$store.commit('updateMusic', true)
      if (this.$store.state.room.teacher.audio === '1') {
        this.$store.dispatch('stopLocalAudioStream', true)
        const params = this.initRoomAttributeData('0', this.$store.state.room.teacher.video)
        const obj = {}
        obj[this.$store.state.room.uid] = JSON.stringify(params)
        await this.$store.dispatch('addOrUpdateRoomAttributes', obj)
      }
      this.playMusic(true)
    },
    async stopMusic () {
      this.musicStart = false
      await this.$store.commit('updateMusic', false)
      this.playMusic(false)
    },
    initRoomAttributeData (audio, video) {
      const data = cloneDeep(this.$store.state.room.teacher)
      data.audio = audio
      data.video = video
      return data
    },
    async playMusic (play) {
      if (play) {
        if (this.$store.state.room.course.courseState && this.$store.state.room.teacher.audio === '1') {
          await this.$store.dispatch('stopLocalAudioStream', true)
          const params = this.initRoomAttributeData('0', this.$store.state.room.teacher.video)
          const obj = {}
          obj[this.$store.state.room.uid] = JSON.stringify(params)
          await this.$store.dispatch('addOrUpdateRoomAttributes', obj)
        }
        this.$store.dispatch('openAudioPlayer', WARM_AUDIO)
        this.$store.dispatch('startAudioPlayer')
        this.$store.dispatch('setAudioPlayerLooping', -1)
        this.$store.dispatch('setAudioSourceType', 2)
        this.$store.dispatch('stopLocalAudioStream', false)
      } else {
        this.$store.dispatch('stopAudioPlayer')
        this.$store.dispatch('stopLocalAudioStream', true)
      }
      // const params = cloneDeep(this.$store.state.room.teacher)
      // params.audio = this.$store.state.room.musicState ? '1' : '0'
      // const obj = {}
      // obj[this.$store.state.room.uid] = JSON.stringify(params)
      // await this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    checkPPT (item, index, e) {
      bus.$emit('changePPT', index)
      this.active = index
      this.clickIndex = index

      const x = e.offsetX
      const y = e.offsetY
      this.$refs.wave[this.clickIndex].style.top = `${y}px`
      this.$refs.wave[this.clickIndex].style.left = `${x}px`

      const timer = setTimeout(() => {
        this.clickIndex = null
        clearTimeout(timer)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.course-ware {
  position: relative;
  margin-top: 1px;
  .tips {
    background: rgb(245, 245, 245);
    color: rgb(153, 153, 153);
    font-size: 14px;
    padding-left: 14px;
    line-height: 28px;
  }
  .warm-audio {
    position: fixed;
    width: 307px;
    background: #fff;
    z-index: 1;
    &:hover {
      background: #eee;
    }
    .audio-item {
      padding: 0 12px;
      display: flex;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      > img {
        height: 20px;
        width: 20px;
        padding-left: 20px;
        cursor: pointer;
      }
      > span {
        flex: 1;
        color: #2E62FD;
      }
    }
  }
  .ppt {
    padding-top: 40px;
    .ppt-wrap {
      height: 210px;
      width: 100%;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 5px;
      &.active {
        .page {
          border-bottom: 7px solid #2E62FD;
          box-sizing: border-box;
        }
      }
      img {
        height: 100%;
        width: 100%;
      }
      .wave {
        width: 1px;
        height: 1px;
        position: absolute;
        z-index: 2;
        margin: auto;
        border-radius: 50%;
        background: rgba(0, 0, 0, .3);
        transform: scale(0);
        &.ac-wave {
          transition: 1s;
          animation: change 1s ease both 1;
        }
      }
      .page {
        position: absolute;
        height: 30px;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
        border-radius:3px;
        padding-left: 12px;
      }
    }
  }
}
@keyframes change {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(800);
    opacity: 0;
  }
}
</style>
