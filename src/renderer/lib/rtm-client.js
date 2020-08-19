import Events from 'events'
import Hummer from 'hummer-rts-sdk'
import LogFactory from '@/common/log'

export class HummerManager {
  constructor () {
    this._event = new Events.EventEmitter()
    this._hmrManager = null

    this._login = false
    this._hmrRoom = null
    this._client = null
    this._hummer = Hummer

    this._log = new LogFactory().New('localFile', {
      logFileName: 'ClassRoom-PC.log',
      logPrefix: '--- App: '
    })
  }

  // 基础方法
  // 初始化SDK
  createHummer (appid) {
    console.log('[RTS] createHummer')
    this._hmrManager = Hummer.createHummer({ appid: appid })
    this._log.info('[RTS] createHummer : ', appid)
    this._hmrManager.on('ConnectionStateChanged', (data) => {
      console.log('[RTS] ConnectionStateChanged : ', data)
      this._log.info('[RTS] ConnectionStateChanged : ', data)
      this.emitThalEvents('ConnectionStateChanged', data)
    })
  }

  // 登录SDK
  login (region, uid, token) {
    return new Promise((resolve, reject) => {
      this._hmrManager.login({ region: region, uid: uid, token: token }).then(result => {
        console.log('[RTS] login Success uid: ', uid)
        this._log.info('[[RTS] login Success : ', result)
        this._login = true
        resolve(result)
      }).catch(err => {
        console.log('[RTS] login Failed err: ', err)
        this._log.error('[[RTS] login Failed : ', err)
        reject(err)
      })
    })
  }

  // 退出SDK
  logout () {
    console.log('调用了 layout  方法')
    return new Promise((resolve, reject) => {
      this._hmrManager.logout().then(result => {
        console.log('[RTS] logout Success')
        this._log.error('[RTS] logout Success : ', result)
        self._login = true
        this.offAll()
        resolve(result)
      }).catch(err => {
        console.log('[RTS] logout Failed err: ', err)
        this._log.error('[RTS] logout Failed err: ', err)
        reject(err)
      })
    })
  }

  // 房间成员管理
  // 创建房间
  createRoom (region, roomId) {
    console.log('[RTS] createRoom region: ', region, ' roomId: ', roomId)
    this._hmrRoom = this._client.createRoom({ region: region, roomId: roomId })
    this._log.info('[RTS] createRoom region && roomId: ', region, roomId)
    this.bindRoomEvent(this._hmrRoom)
  }

  // 加入房间
  join (params) {
    return new Promise((resolve, reject) => {
      this._hmrRoom.join(params).then(res => {
        console.log('[RTS] join Success')
        this._log.info('[RTS] join Success ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] join Failed err: ', err)
        this._log.error('[RTS] join Failed ', err)
        reject(err)
      })
    })
  }

  // 离开房间
  leave (params) {
    console.log('调用了  leave 方法')
    return new Promise((resolve, reject) => {
      this._hmrRoom.leave(params).then(res => {
        console.log('[RTS] leave Success')
        this._log.info('[RTS] leave Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] leave Failed err: ', err)
        this._log.error('[RTS] leave Failed: ', err)
        reject(err)
      })
    })
  }

  // 查询房间人数
  getMembers () {
    console.log('调用了getMembers方法')
    return new Promise((resolve, reject) => {
      this._hmrRoom.getMembers().then(res => {
        console.log('[RTS] getMembers Success')
        this._log.info('[RTS] getMembers Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] getMembers Failed err: ', err)
        this._log.error('[RTS] getMembers Failed: ', err)
        reject(err)
      })
    })
  }

  // 点对点消息
  // 创建实例
  createRTSInstance () {
    console.log('[RTS] createRTSInstance')
    this._log.info('[RTS] createRTSInstance')
    this._client = this._hmrManager.createRTSInstance()
    return this._client
  }

  // 发送单播消息
  sendMessageToUser (message) {
    console.log('[RTS] sendMessageToUser params:', message)
    return new Promise((resolve, reject) => {
      this._client.sendMessageToUser(message).then(res => {
        console.log('[RTS] sendMessageToUser Success', res)
        this._log.info('[RTS] sendMessageToUser Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] sendMessageToUser Failed err: ', err)
        this._log.error('[RTS] sendMessageToUser Failed: ', err)
        reject(err)
      })
    })
  }

  // 房间管理
  // 设置频道属性
  setRoomAttributes (attributes) {
    const req = { attributes, options: { enableNotification: true } }
    return new Promise((resolve, reject) => {
      this._hmrRoom.setRoomAttributes(req).then(res => {
        console.log('[RTS] setRoomAttributes Success')
        this._log.info('[RTS] setRoomAttributes Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] setRoomAttributes Failed err: ', err)
        this._log.error('[RTS] setRoomAttributes err: ', err)
        reject(err)
      })
    })
  }

  // 添加或者更新频道属性
  addOrUpdateRoomAttributes (attributes) {
    const req = { attributes, options: { enableNotification: true } }
    return new Promise((resolve, reject) => {
      this._hmrRoom.addOrUpdateRoomAttributes(req).then(res => {
        console.log('[RTS] addOrUpdateRoomAttributes Success')
        this._log.info('[RTS] addOrUpdateRoomAttributes Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] addOrUpdateRoomAttributes Failed: err', err)
        this._log.error('[RTS] addOrUpdateRoomAttributes Failed: ', err)
        reject(err)
      })
    })
  }

  // 删除频道属性
  deleteRoomAttributesByKeys (keys) {
    const req = { keys, options: { enableNotification: true } }
    return new Promise((resolve, reject) => {
      this._hmrRoom.deleteRoomAttributesByKeys(req).then(res => {
        console.log('[RTS] deleteRoomAttributes Success')
        this._log.info('[RTS] deleteRoomAttributes Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] deleteRoomAttributes Failed err: ', err)
        this._log.error('[RTS] deleteRoomAttributes Failed: ', err)
        reject(err)
      })
    })
  }

  // 获取房间频道属性
  getRoomAttributes (params) {
    return new Promise((resolve, reject) => {
      this._hmrRoom.getRoomAttributes(params).then(res => {
        console.log('[RTS] getRoomAttributes Success')
        this._log.info('[RTS] getRoomAttributes Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] getRoomAttributes Failed err: ', err)
        this._log.error('[RTS] getRoomAttributes Failed: ', err)
        reject(err)
      })
    })
  }

  // 发送广播消息
  sendMessage (params) {
    return new Promise((resolve, reject) => {
      this._hmrRoom.sendMessage(params).then(res => {
        console.log('[RTS] sendMessage Success')
        this._log.info('[RTS] sendMessage Success: ', res)
        resolve(res)
      }).catch(err => {
        console.log('[RTS] sendMessage Failed err: ', err)
        this._log.error('[RTS] sendMessage Failed: ', err)
        reject(err)
      })
    })
  }

  // 事件回调
  bindRoomEvent (rtmRoom) {
    rtmRoom.on('RoomMessage', (data) => {
      console.log('[RTS] RoomMessage data: ', data)
      this.emitThalEvents('RoomMessage', data)
    })
    rtmRoom.on('RoomAttributesAddedOrUpdated', (data) => {
      console.log('[RTS] RoomAttributesAddedOrUpdated data: ', data)
      this.emitThalEvents('RoomAttributesAddedOrUpdated', data)
    })
    rtmRoom.on('RoomAttributesDeleted', (data) => {
      console.log('[RTS] RoomAttributesDeleted data: ', data)
      this.emitThalEvents('RoomAttributesDeleted', data)
    })
    rtmRoom.on('MemberLeft', (data) => {
      console.log('[RTS] MemberLeft data: ', data)
      this.emitThalEvents('MemberLeft', data)
    })
    rtmRoom.on('MemberJoined', (data) => {
      console.log('[RTS] MemberJoined data: ', data)
      this.emitThalEvents('MemberJoined', data)
    })
    rtmRoom.on('RoomMemberOffline', () => {
      console.log('[RTS] RoomMemberOffline data: ')
      this.emitThalEvents('RoomMemberOffline')
    })
  }

  on (event, listener, target) {
    if (!event) {
      return -1
    }

    if (!listener) {
      return -1
    }

    if (target) {
      this._event.on(event, listener.bind(target))
    } else {
      this._event.on(event, listener)
    }
  }

  off (eventName, ...args) {
    this._event.removeListener(eventName, ...args)
  }

  offAll () {
    this._event.removeAllListeners()
  }

  emitThalEvents (eventName, ...args) {
    if (!eventName) {
      console.warn('Invalid eventName to emit internal event')
      return
    }

    if (!this._event) {
      console.warn('Invalid event emitter.')
      return
    }

    try {
      this._event.emit(eventName, ...args)
    } catch (e) {
      console.warn('Failed to emit internal events:' + eventName + ', exception: ' + JSON.stringify(e))
    }
  }
}
