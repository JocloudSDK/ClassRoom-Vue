<template>
  <div class="login" v-loading="$store.state.room.loading">
    <div class="login-wrap">
      <div class="login-top">
        <div class="app-name">
          <span>{{lang.login.AppName}} </span>
          <span>{{lang.login.AppNameDes}}</span>
        </div>
        <div class="app-des mt_30">
          <div class="des"></div>
          <img src="../../assets/img/login/person.png" alt="">
        </div>

      </div>

      <div class="login-bottom">
        <div class="login-form">
          <el-form ref="form">
            <custom-form
              prop="className"
              pattern="number"
              v-model="login.roomId"
              :label="lang.login.ClassName"
              :errorTips="lang.login.ClassNameBlankTips"
              :minError="lang.login.ClassNameMinTips"
              :maxlength="8"
              :minlength="4"
              required
              :placeholder="lang.login.ClassNamePlaceholder">
            </custom-form>

            <custom-form
              prop="nick"
              v-model="login.nick"
              :label="lang.login.NickName"
              :errorTips="lang.login.NickNameBlankTips"
              :maxlength="16"
              required
              :placeholder="lang.login.NickNamePlaceholder">
            </custom-form>

            <custom-form
              prop="classType"
              v-model="login.classType"
              type="select"
              :label="lang.login.ClassType"
              :options="classTypeOptions">
            </custom-form>

            <custom-form
              prop="role"
              v-model="login.role"
              type="select"
              :label="lang.login.Role"
              :options="roleOptions">
            </custom-form>

            <custom-button
              className="login-btn"
              :btnText="lang.login.LoginText"
              @click-btn="enterClassRoom"
              ></custom-button>
          </el-form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import lang from '@/common/mixins/lang'
import CustomForm from '@/components/form'
import CustomButton from '@/components/custom-button'
import {
  APP_CONFIG,
  APPID
} from '@/common/config'
import {
  each,
  cloneDeep
} from 'lodash'
import {
  STORAGE,
  REQUEST_URL
} from '@/common/const'
import mixins from '@/pages/classroom/com/mixins'

export default {
  data () {
    return {
      hummer: null,
      rtm: null,
      APP_CONFIG,
      classname: null,
      language: null,
      token: null,
      userId: null,
      login: {
        roomId: null,
        nick: null,
        classType: null,
        role: null
      },
      roleOptions: [],
      classTypeOptions: []
    }
  },
  created () {
    if (!APPID) {
      return this.$confirm(this.lang.login.ErrorTips, this.lang.login.Tips, {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: this.lang.setting.Confirm,
        customClass: 'yy-confirm'
      })
    }
    this.initData()
    this.getToken()
  },
  mixins: [lang, mixins],
  components: {
    CustomForm,
    CustomButton
  },
  watch: {
    '$store.state.global.lang' (v) {
      this.initData()
    }
  },
  methods: {
    async getToken () {
      this.userId = this.$storage.get(STORAGE.KEY_UID)
        ? this.$storage.get(STORAGE.KEY_UID)
        : this.getUserId()
      this.$storage.set(STORAGE.KEY_UID, this.userId)
      this.$store.commit('updateUID', this.userId)
      const params = {
        app_id: APPID,
        user_id: this.userId
      }
      if (!REQUEST_URL.API) {
        this.token = ''
        this.$storage.set(STORAGE.KEY_TOKEN, this.token)
        this.initialize()
      } else {
        await this.$axios.post(`${REQUEST_URL.API}getToken`, params).then(res => {
          this.token = res.token
          this.$storage.set(STORAGE.KEY_TOKEN, this.token)
          this.initialize()
        }).catch(() => {
          this.getToken()
        })
      }
    },

    getUserId () {
      const str = String(new Date().getTime())
      return str.substring(str.length - 8)
    },

    initialize () {
      this.$store.dispatch('initialize', {
        APPID: APPID,
        token: this.token
      })
    },

    async loginHummer () {
      return await this.$store.dispatch('login', {
        uid: this.userId,
        token: this.token
      })
    },

    initData () {
      if (this.$store.state.room.loginMessage) {
        this.login = cloneDeep(this.$store.state.room.loginMessage)
      } else {
        this.initLoginData()
      }
      this.iniClassTypeOptions()
      this.initRoleOptions()
    },

    initLoginData () {
      const _login = cloneDeep(this.login)
      const classKey = 'SClass'
      const roleKey = 'Teacher'
      _login.classType = classKey
      _login.role = roleKey
      this.login = _login
    },

    iniClassTypeOptions () {
      const _options = []
      each(this.lang.login.ClassTypeOptions, (val, key) => {
        const obj = {}
        obj.key = key
        obj.label = val
        _options.push(obj)
      })
      this.classTypeOptions = cloneDeep(_options)
    },

    initRoleOptions () {
      const _options = []
      each(this.lang.login.RoleOptions, (val, key) => {
        const obj = {}
        obj.key = key
        obj.label = val
        _options.push(obj)
      })
      this.roleOptions = cloneDeep(_options)
    },

    // 进入课堂
    async enterClassRoom () {
      const validator = this.validator(this.$refs.form)
      if (!validator) {
        const loginRes = await this.loginHummer()
        console.log('[LOGIN] Hummer login res: ', loginRes)
        if (loginRes.rescode !== 0) return this.$toast(loginRes.msg)

        const res = await this.joinRoom()
        if (res.rescode === 0) {
          this.$store.commit('updateLoginMessage', {
            roomId: this.login.roomId,
            nick: this.login.nick,
            classType: this.login.classType,
            role: this.login.role
          })
          await this.addOrUpdateRoomAttributes()
          await this.joinSendroommessage()
          this.$router.push({
            name: 'Classroom',
            params: {
              id: this.login.roomId,
              type: this.login.classType
            }
          })
        } else if (res === false) {
          this.$toast(this.lang.login.AlreadyHasTeacher)
          this.$store.commit('updateAllUsers')
          this.$store.commit('updateUser')
        } else {
          // joinroom failed
          this.$toast(this.lang.login.JoinroomFailed)
        }
      }
    },
    async joinSendroommessage () {
      const message = {
        msg_content: '',
        msg_time: Date.now() / 1000,
        msg_nickname: this.login.NickName,
        msg_type: 1
      }
      const data = this.buildCommand('message', null, message)

      console.log('sendMessage params', data)
      await this.$store.dispatch('sendMessageToChannel', {
        content: this.$hummer._hummer.Utify.encodeStringToUtf8Bytes(data)
      })
    },
    addOrUpdateRoomAttributes () {
      const publicMessage = this.login.classType === 'SClass'
        ? '小班课'
        : this.login.classType === 'LClass'
          ? '大班课'
          : '一对一'

      const sObj = {
        nickname: this.login.nick,
        uid: this.userId,
        audio: '0',
        video: '0',
        class_mute: '1',
        board_uuid: null,
        role: '1',
        class_state: '0',
        public_message: `欢迎使用聚联云${publicMessage}`,
        class_type: this.login.classType.slice(0, 1)
      }

      const obj = {}
      obj[this.userId] = JSON.stringify(sObj)

      return this.$store.dispatch('addOrUpdateRoomAttributes', obj)
    },
    getRoomAttributes () {
      return this.$store.dispatch('getRoomAttributes', {
        roomId: `${this.login.classType.slice(0, 1)}${this.login.roomId}`
      })
    },

    joinRoom () {
      return this.$store.dispatch('joinRoom', {
        roomId: this.login.roomId,
        token: this.token,
        uid: this.userId,
        type: this.login.classType.slice(0, 1)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  height: 100%;
  width: 100%;
  background: url('../../assets/img/login/bg.png') no-repeat;
  filter: blur(0px);
  background-size: contain;
  .login-wrap {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: fit-content;
    .login-top {
      width: 345px;
      margin: auto;
      position: relative;
      .app-name {
        color: #2E62FD;
        font-size: 24px;
        text-align: left;
        font-weight: 500;
        &.app-name-zh {
          margin-bottom: 16px;
        }
        span {
          &:first-child {
            display: block;
            font-weight: 500;
            line-height: 32px;
          }
          &:last-child {
            color: #333333;
            font-size: 18px;
            font-weight: 400;
            line-height: 32px;
          }
        }
      }
      .app-des {
        display: flex;
        justify-content: space-between;
        img {
          width: 140px;
          position: absolute;
          right: -12px;
          top: 0;
        }
        &.mt_30 {
          margin-top: -18px;
        }
        .des {
          span {
            font-size: 14px;
            text-align: left;
            color: #999;
            line-height: 20px;
            font-weight: 400;
          }
          margin: 10px 0 22px;
        }
      }
    }
    .login-bottom {
      position: relative;
      width: 300px;
      margin: auto;
      background: #fff;
      padding: 15px 22px 25px;
      box-shadow: 0px 8px 35px 0px rgba(158,164,221,0.17);
      border-radius: 12px;
      z-index: 1;
      .login-btn {
        margin-top: 20px;
        width: 100%;
      }
    }
  }
}
</style>
