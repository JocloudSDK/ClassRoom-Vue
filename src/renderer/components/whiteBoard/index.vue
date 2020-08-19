<template>
  <div class='white_board' v-if="$store.state.room.course.courseState"
    v-loading="$store.state.whiteboard.loading">
    <div ref="white_board" class='white-board'></div>

    <div v-if="$store.state.room.course.courseState == 1" class='white_board_left'>
      <template v-for="item in settingIcons">
        <el-tooltip class="item"
          :key="item.value"
          effect="dark"
          :content="item.tip"
          v-show="item.show"
          placement="right">
          <img
            :src="item.url"
            @click="clickAppliance(item.value)"
            :class="item.value === activeName ? 'active' : ''"
            class="set-png">
        </el-tooltip>
      </template>
    </div>

    <sketch-picker v-if="$store.state.whiteboard.isShowColorPicker"
      @input="updateColor"
      class="color-picker"
      v-model="colors" />

    <div v-if="$store.state.room.course.courseState == 1" class='white_board_left_bottom'>
      <img @click="moveRuleIndex(-1)" src="@/assets/img/white_board_tools/white_page_min.png">
      <p>{{parseInt($store.state.whiteboard.scale * 100)}}%</p>
      <img @click="moveRuleIndex(+1)" src="@/assets/img/white_board_tools/white_page_plus.png">
    </div>

    <div v-if="$store.state.room.course.courseState == 1" class='white_board_right_bottom'>
      <div class="white_board_ppt">
        <img @click="setSceneIndex('page_first')"
          :class="room && room.state.sceneState.index == 0 ? 'img-disabled' : ''"
          src="@/assets/img/white_board_tools/page_first.png">
        <img @click="setSceneIndex('page_previous')"
          :class="room && room.state.sceneState.index == 0 ? 'img-disabled':''"
          src="@/assets/img/white_board_tools/page_previous.png">
        <div>
          <p>{{room && room.state ? (room.state.sceneState.index) + 1 + "/" + (room.state.sceneState.scenes.length):'1/1'}}</p>
        </div>
        <img @click="setSceneIndex('page_next')"
          :class="room && room.state.sceneState.index == room.state.sceneState.scenes.length - 1?'img-disabled':''"
          src="@/assets/img/white_board_tools/page_next.png">
        <img @click="setSceneIndex('page_latest')"
          src="@/assets/img/white_board_tools/page_latest.png"
          :class="room && room.state.sceneState.index == room.state.sceneState.scenes.length - 1?'img-disabled':''">
      </div>

      <el-tooltip
        effect="dark"
        :content="$store.state.whiteboard.PPTMode?lang.class.ChangeToWhiteboard:lang.class.ChangeToPPT"
        placement="top"
        >
        <img class="whiteBoardBottomButtonCommon"
          @click="changePPTMode"
          :src="!$store.state.whiteboard.PPTMode?pptIcon:whiteboardIcon" >
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { NETLESSSDKTOKEN } from '@/common/config'
import { ViewMode } from 'white-web-sdk'
import { PPT, DIVIDINGRULE, REQUEST_URL } from '@/common/const'
import { each } from 'lodash'
import bus from '@/bus'
import pptIcon from '@/assets/img/white_board_tools/PPT-icon.png'
import whiteboardIcon from '@/assets/img/white_board_tools/white-board.png'
import { Sketch } from 'vue-color'
import lang from '@/common/mixins/lang'
import SelectorPNG from '@/assets/img/white_board_tools/white_board_tool_selector.png'
import PencilPNG from '@/assets/img/white_board_tools/white_board_tool_pen.png'
import RectanglePNG from '@/assets/img/white_board_tools/white_board_tool_rect.png'
import EllipsePNG from '@/assets/img/white_board_tools/white_board_tool_cycle.png'
import TextPNG from '@/assets/img/white_board_tools/white_board_tool_font.png'
import EraserPNG from '@/assets/img/white_board_tools/white_board_tool_earser.png'
import CcolorPickerPNG from '@/assets/img/white_board_tools/white_board_tool_color.png'
import NewPagePNG from '@/assets/img/white_board_tools/white_board_tool_new_page.png'
import MovePNG from '@/assets/img/white_board_tools/white_board_tool_move.png'

export default {
  components: {
    'sketch-picker': Sketch
  },
  watch: {
    '$store.state.room.course.courseState' (v) {
      if (v === 1) {
        this.createJoinRoom()
      }
    },
    '$store.state.whiteboard.PPTMode' (v) {
      if (!this.room) {
        return
      }
      this.initSettingIcons(this.$store.state.whiteboard.PPTMode)
      if (v) {
        this.room.setScenePath(`/PPT/${this.scenes[this.pptIndex].name}`)
      } else {
        this.room.setScenePath('/init')
      }
    }
  },
  data () {
    return {
      settingIcons: [
        { url: SelectorPNG, value: 'selector', key: 'SelectorIcon' },
        { url: PencilPNG, value: 'pencil', key: 'PenIcon' },
        { url: RectanglePNG, value: 'rectangle', key: 'RectIcon' },
        { url: EllipsePNG, value: 'ellipse', key: 'EllipseIcon' },
        { url: TextPNG, value: 'text', key: 'TextIcon' },
        { url: EraserPNG, value: 'eraser', key: 'EraserIcon' },
        { url: CcolorPickerPNG, value: 'color_picker', key: 'ColorPickerIcon' },
        { url: NewPagePNG, value: 'newPage', key: 'NewPageIcon' },
        { url: MovePNG, value: 'move', key: 'HandleSelectorIcon' }
      ],
      scenes: [],
      room: null,
      pptIcon,
      whiteboardIcon,
      colors: { r: 255, g: 0, b: 0 },
      activeName: 'pencil',
      pptIndex: 0
    }
  },
  created () {
    this.initSettingIcons()
    bus.$on('changePPT', (index) => {
      this.pptIndex = index
      if (this.room) {
        // 切换到PPT页面
        const url = PPT[index].url
        var strs = url.split('/')
        var sceneName = strs[strs.length - 1]
        if (this.$store.state.whiteboard.PPTMode) {
          this.room.setScenePath(`/PPT/${sceneName}`)
        }
      }
    })
  },
  mixins: [lang],
  methods: {
    initSettingIcons (flag = true) {
      each(this.settingIcons, item => {
        item.tip = this.lang.class[item.key]
        item.show = true
        if (flag && item.value === 'newPage') {
          item.show = false
        } else {
          item.show = true
        }
      })
    },
    setSceneIndex (index) {
      if (this.room) {
        if (index === 'page_first') {
          this.room.setSceneIndex(0)
        } else if (index === 'page_previous') {
          if (this.room.state.sceneState.index === 0) return
          this.room.setSceneIndex(this.room.state.sceneState.index - 1)
        } else if (index === 'page_next') {
          if (this.room.state.sceneState.index + 1 > this.room.state.sceneState.scenes.length - 1) {
            return
          }
          this.room.setSceneIndex(this.room.state.sceneState.index + 1)
        } else if (index === 'page_latest') {
          this.room.setSceneIndex(this.room.state.sceneState.scenes.length - 1)
        }
        bus.$emit('change_PPT', this.room.state.sceneState.index)
      }
    },
    pathName (path) {
      const reg = /\/([^/]*)\//g
      reg.exec(path)
      if (RegExp.$1 === 'aria') {
        return ''
      } else {
        return RegExp.$1
      }
    },
    updateColor (data) {
      if (this.room) {
        this.room.setMemberState({
          strokeColor: [data.rgba.r, data.rgba.g, data.rgba.b]
        })
      }
    },
    clickAppliance (applianceName) {
      if (!this.room) {
        return
      }
      this.activeName = applianceName
      if (applianceName === 'color_picker') {
        const result = this.$store.state.whiteboard.isShowColorPicker
        this.$store.commit('isShowColorPicker', !result)
        return
      } else if (applianceName === 'move') {
        // 主动激活
        this.room.handToolActive = true
        this.room.setMemberState({ currentApplianceName: 'selector' })
        if (this.room.roomState && this.room.roomState.course) {
          this.room.roomState.course.lockBoard()
        }
        return
      } else if (applianceName === 'newPage') {
        if (this.$store.state.whiteboard.PPTMode) {
          return
        }
        if (this.room.state.sceneState) {
          const newSceneIndex = this.room.state.sceneState.index
          const scenePath = this.room.state.sceneState.scenePath
          const pathName = this.pathName(scenePath)
          console.log('白板增加一页By roomState pathName：' + pathName)
          this.room.putScenes(`/${pathName}`, [{}], newSceneIndex)
          this.room.setSceneIndex(newSceneIndex)
          console.log('白板增加一页By roomState')
        }
        return
      } else if (applianceName === 'uploadPPT') {
        return
      }
      this.$store.commit('isShowColorPicker', false)
      this.room.handToolActive = false
      console.log(applianceName)
      this.room.setMemberState({
        currentApplianceName: applianceName
      })
    },
    moveRuleIndex (deltaIndex) {
      console.log('moveRuleIndex')
      if (this.tempRuleIndex === undefined) {
        this.tempRuleIndex = this.readRuleIndexByScale(this.$store.state.whiteboard.scale)
      }
      this.tempRuleIndex += deltaIndex

      if (this.tempRuleIndex > DIVIDINGRULE.length - 1) {
        this.tempRuleIndex = DIVIDINGRULE.length - 1
      } else if (this.tempRuleIndex < 0) {
        this.tempRuleIndex = 0
      }
      const targetScale = DIVIDINGRULE[this.tempRuleIndex]

      if (this.room) {
        this.room.zoomChange(targetScale)
      }
      console.log(targetScale)
    },
    readRuleIndexByScale (scale) {
      if (scale < DIVIDINGRULE[0]) {
        return 0
      }
      for (let i = 0; i < DIVIDINGRULE.length; ++i) {
        const prePoint = DIVIDINGRULE[i - 1]
        const point = DIVIDINGRULE[i]
        const nextPoint = DIVIDINGRULE[i + 1]

        const begin = prePoint === undefined ? Number.MIN_SAFE_INTEGER : (prePoint + point) / 2
        const end = nextPoint === undefined ? Number.MAX_SAFE_INTEGER : (nextPoint + point) / 2

        if (scale >= begin && scale <= end) {
          return i
        }
      }
      return DIVIDINGRULE.length - 1
    },
    async changePPTMode () {
      if (!this.room) {
        return
      }

      await this.$store.dispatch('NETLESS_CHANGE_PPT_MODE', {})
    },
    onWindowResize () {
      if (this.room) {
        this.room.moveCamera({ centerX: 0, centerY: 0 })
        this.room.refreshViewSize()
        this.room.convertToPointInWorld({ x: 0, y: 0 })
      }
    },
    async createJoinRoom () {
      if (!REQUEST_URL.NETLESS) return
      const result = await this.$axios.post(`${REQUEST_URL.NETLESS}room?token=${NETLESSSDKTOKEN}`, {
        name: 'id',
        limit: 0,
        mode: 'historied'
      })
      this.$store.commit('initUUID', result.msg.room.uuid)

      const uuid = this.$store.state.whiteboard.uuid || result.msg.room.uuid
      await this.$axios.post(`${REQUEST_URL.NETLESS}room/join?token=${NETLESSSDKTOKEN}&uuid=${uuid}`)

      try {
        this.room = await this.$store.dispatch('NETLESS_JOIN_ROOM', {})
        if (this.room) {
          this.room.bindHtmlElement(this.$refs.white_board)
          // 设置默认为画笔
          this.room.setMemberState({
            currentApplianceName: 'pencil'
          })
          // 设置默认颜色
          this.room.setMemberState({
            strokeColor: [255, 120, 0]
          })
          // 设置为主播模式
          this.room.setViewMode(ViewMode.Broadcaster)
          // 防止退出后再次进入无法操作的问题，去掉会出问题
          this.room.refreshViewSize()
          if (this.scenes.length === 0) {
            each(PPT, (image, index) => {
              // 创建一个白板页面
              var strs = image.url.split('/')
              var sceneName = strs[strs.length - 1]
              const scene = { name: `${sceneName}`, ppt: { src: image.url, width: 1080, height: 720 } }
              this.scenes.push(scene)
            })
          }
          this.room.putScenes('/PPT', this.scenes, this.pptIndex)
          this.room.setScenePath(`/PPT/${this.scenes[this.pptIndex].name}`)
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  async mounted () {
    window.addEventListener('resize', this.onWindowResize)
  }
}
</script>

<style lang="less" scoped>
.white_board {
  width: 100%;
  height: 100%;
  position: relative;
  .white_board_left{
    display: flex;
    width: 60px;
    height: auto;
    border-radius: 6px;
    z-index: 6;
    position: absolute;
    top: 30px;
    left: 15px;
    flex-direction: column;
    text-align: center;
    border: 1px solid rgba(229,229,229,1);
    background: #fff;
    > img {
      width: 34px;
      height: auto;
      padding: 8px;
      border-radius: 4px;
      margin: 5px 5px 5px 5px;
      &.active {
        background: rgba(216, 216, 216, 0.2);
        border-radius: 4px;
      }
    }
    > img:hover {
        cursor: pointer;
        background: rgba(216, 216, 216, 0.2);
        border-radius: 4px;
    }
    > img:disabled {
      background: rgba(216, 216, 216, 0.2);
      border-radius: 4px;
    }
  }
  .white-board {
    background: rgba(255,255,255,1);
    height: 100%;
  }
  .white_board_left_bottom {
    display: flex;
    width: fit-content;
    height: 40px;
    justify-content: space-evenly;
    background: rgba(255,255,255,1);
    border-radius: 6px;
    position: absolute;
    bottom: 10px;
    z-index: 6;
    left: 15px;
    padding: 0 4px 0 4px;
    border: 1px solid rgba(224,224,224,1);
    p {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      align-self: center;
    }
    img {
      width: 32px;
      height: auto;
      object-fit: scale-down;
      border-radius: 6px;
      // width: 32px;
      // height: auto;
      // cursor: pointer;
      // background: rgba(245, 245, 245, 1);
      border-radius: 6px;
      align-self: center;
      margin: 0 4px 0 4px;
    }
    img:hover {
      cursor: pointer;
      background: rgba(245, 245, 245, 1);
      border-radius: 6px;
    }
  }
  .white_board_right_bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    right: 19px;
    z-index: 6;
    > img {
      width: 32px;
      height: 32px;
      object-fit: scale-down;
      border-radius: 6px;
      background: #fff;
       &:nth-child(1) {
        width: 42px;
        height: auto;
        align-self: center;
        margin: 0 19px 0 0;
      }
      &:nth-child(3) {
        width: 42px;
        height: auto;
        align-self: center;
        margin: 0 0 0 0;
      }
      &:nth-child(2) {
        width: 42px;
        height: auto;
        align-self: center;
        margin: 0 19px 0 0;
      }
    }
    .white_board_ppt {
      width: fit-content;
      display: flex;
      flex-direction: row;
      margin: 0 19px 0 0;
      justify-content: space-evenly;
      background: rgba(255,255,255,1);
      border-radius: 6px;
      border: 1px solid rgba(224,224,224,1);
      img {
        width: 32px;
        height: 32px;
        object-fit: scale-down;
        border-radius: 6px;
        align-self: center;
        margin: 4px 2px 4px 5px;
        &.img-disabled {
          background: rgba(245, 245, 245, 1);
          border-radius: 6px;
        }
      }
      img:hover {
        cursor: pointer;
        background: rgba(245, 245, 245, 1);
        border-radius: 6px;
      }
      img {
        &.disabled {
          background: rgba(245, 245, 245, 1);
          border-radius: 6px;
        }
      }
      div {
        background: rgba(245,245,245,1);
        border-radius: 6px;
        align-self: center;
        p {
          margin: 7px 18px 5px 16px;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          align-self: center;
        }
      }
    }
    .whiteBoardBottomButtonCommon {
      width: 32px;
      height: 32px;
      object-fit: scale-down;
      border-radius: 6px;
      cursor: pointer;
    }
  }
}

.color-picker {
  z-index: 6;
  position: absolute;
  top: 100px;
  left: 70px;
}
</style>
