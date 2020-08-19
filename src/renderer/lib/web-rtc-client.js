import Events from 'events'
import WebRTC from 'thunderbolt-web-sdk'

export class WebThunderManager {
  constructor () {
    this._event = new Events.EventEmitter()
    this._rtcEngine = new WebRTC()
    this._initialize = false
    this._joined = null
  }

  // 初始化SDK
  init (appid) {
    console.log('[TB] init appid: ', appid)
    const res = this._rtcEngine.init(appid)
    return res
  }

  // 检查SDK是否适配正在运行的浏览器
  isSupported () {
    const res = WebRTC.isSupported()
    console.log('[TB] isSupported status: ', res)
    return res
  }

  // 获取版本号
  version () {
    console.log('[TB] version')
    const res = WebRTC.VERSION()
    return res
  }

  // 加入房间
  joinRoom (param) {
    console.log('[TB] joinRoom param: ', param)
    return new Promise((resolve, reject) => {
      this._rtcEngine.joinRoom(param).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 离开房间
  leaveRoom () {
    console.log('[TB] leaveRoom')
    const res = this._rtcEngine.leaveRoom()
    return res
  }

  // 设置区域
  setArea (oversea) {
    console.log('[TB] setArea area: ', oversea)
    const res = this._trcEngine.setArea(oversea)
    return res
  }

  // 创建音视频流
  createStream (param) {
    console.log('[TB] createStream param: ', param)
    return new Promise((resolve, reject) => {
      this._rtcEngine.createStream(param).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 关闭音视频流
  closeStream () {
    console.log('[TB] closeStream')
    const res = this._rtcEngine.closeStream()
    return res
  }

  // 推送音视频流
  publish () {
    console.log('[TB] publish')
    return new Promise((resolve, reject) => {
      this._rtcEngine.publish().then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 取消推送音视频流
  unpublish () {
    console.log('[TB] unpublish')
    const res = this._rtcEngine.unpublish()
    return res
  }

  // 设置麦克风音量
  setPublisherVolume (volume) {
    console.log('[TB] setPublisherVolume volume: ', volume)
    const res = this._rtcEngine.setPublisherVolume(volume)
    return res
  }

  // 设置视频档位
  setVideoMode (videoMode) {
    console.log('[TB] setVideoMode videoMode: ', videoMode)
    return new Promise((resolve, reject) => {
      this._rtcEngine.setVideoMode(videoMode).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 订阅远端视频流
  subscribe (remoteStream, option) {
    console.log('[TB] subscribe remoteStream: ', remoteStream, ' option: ', option)
    return new Promise((resolve, reject) => {
      this._rtcEngine.subscribe(remoteStream, option).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 取消订阅远端视频流
  unsubscribe (remoteStream) {
    console.log('[TB] unsubscribe remoteStream: ', remoteStream)
    return new Promise((resolve, reject) => {
      this._rtcEngine.unsubscribe(remoteStream).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 播放音视频流
  play (uid, element, option) {
    console.log('[TB] play uid: ', uid)
    return new Promise((resolve, reject) => {
      this._rtcEngine.play(uid, element, option).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 停止播放音视频流
  stopPlay (uid) {
    console.log('[TB] stopPlay uid: ', uid)
    const res = this._rtcEngine.stopPlay(uid)
    return res
  }

  // 用户是否有音频流
  hasAudio (uid) {
    const res = this._rtcEngine.hasAudio(uid)
    console.log('[TB] hasAudio uid: ', uid, ' status: ', res)
    return res
  }

  // 用户是否有视频流
  hasVideo (uid) {
    const res = this._rtcEngine.hasVideo(uid)
    console.log('[TB] hasVideo uid: ', uid, ' status: ', res)
    return res
  }

  // 对于本地流，打开音频采集并发送，对于远端订阅流，接收音频数据并播放
  enableAudio (uid) {
    console.log('[TB] enableAudio uid: ', uid)
    const res = this._rtcEngine.enableAudio(uid)
    return res
  }

  // 对于本地流，打开视频采集并发送，对于远端订阅流，接收视频数据并播放。
  enableVideo (uid) {
    console.log('[TB] enableVideo uid: ', uid)
    const res = this._rtcEngine.enableVideo(uid)
    return res
  }

  // 对于本地流，会发送静音音频，对于远端订阅流，会接收音频数据并播放静音
  disableAudio (uid) {
    console.log('[TB] disableAudio uid:', uid)
    const res = this._rtcEngine.disableAudio()
    return res
  }

  // 对于本地流，会发送黑屏视频，对于远端订阅流，会接收视频数据并播放黑屏。
  disableVideo (uid) {
    console.log('[TB] disableVideo uid', uid)
    const res = this._rtcEngine.disableVideo(uid)
    return res
  }

  // 开启音乐文件与麦克风的混音
  startAudioMixing (param, id) {
    return new Promise((resolve, reject) => {
      this._rtcEngine.startAudioMixing(param, id).then((result) => {
        console.log('[TB] startAudioMixing Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] startAudioMixing Failed err: ', err)
        reject(err)
      })
    })
  }

  // 开启音乐文件与麦克风的混音
  stopAudioMixing (id) {
    console.log('[TB] stopAudioMixing')
    const res = this._rtcEngine.stopAudioMixing(id)
    return res
  }

  // 获取浏览器的音频输入设备信息
  getAudioDevices () {
    return new Promise((resolve, reject) => {
      WebRTC.getAudioDevices().then(result => {
        console.log('[TB] getAudioDevices Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] getAudioDevices Failed err: ', err)
        reject(err)
      })
    })
  }

  // 获取浏览器的视频输入设备信息
  getVideoDevices () {
    return new Promise((resolve, reject) => {
      WebRTC.getVideoDevices().then(result => {
        console.log('[TB] getVideoDevices Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] getVideoDevices Failed err: ', err)
        reject(err)
      })
    })
  }

  // 获取浏览器的音频输出设备信息
  getPlayoutDevices () {
    return new Promise((resolve, reject) => {
      WebRTC.getPlayoutDevices().then(result => {
        console.log('[TB] getPlayoutDevices Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] getPlayoutDevices Failed err: ', err)
        reject(err)
      })
    })
  }

  // 选择音频输出设备
  setAudioOutputDevice (uid, deviceId) {
    return new Promise((resolve, reject) => {
      this._rtcEngine.setAudioOutputDevice(uid, deviceId).then(result => {
        console.log('[TB] setAudioOutputDevice Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] setAudioOutputDevice Failed err: ', err)
        reject(err)
      })
    })
  }

  // 动态切换音视频输入设备
  changeDevice (kind, deviceId) {
    return new Promise((resolve, reject) => {
      this._rtcEngine.changeDevice(kind, deviceId).then(result => {
        console.log('[TB] changeDevice Success')
        resolve(result)
      }).catch(err => {
        console.log('[TB] changeDevice Failed err:', err)
        reject(err)
      })
    })
  }

  // 开启音量上报
  enableAudioLevelReport () {
    console.log('[TB] enableAudioLevelReport')
    const res = this._rtcEngine.enableAudioLevelReport()
    return res
  }

  // 获取当前本地流的声音音量
  getPublisherAudioLevel () {
    console.log('[TB] getPublisherAudioLevel')
    const res = this._rtcEngine.getPublisherAudioLevel()
    return res
  }

  bindThunderEvent () {
    // 进入房间成功回调
    this._rtcEngine.on('join_room_succ', (data) => {
      this.emitThalEvents('join_room_succ', data)
    })
    // 进入房间失败回调
    this._rtcEngine.on('join_room_fail', (data) => {
      this.emitThalEvents('join_room_fail', data)
    })
    // 音频输入设备变化回调
    this._rtcEngine.on('audio_input_changed', (data) => {
      this.emitThalEvents('audio_input_changed', data)
    })
    // 视频呢输入设备变化回调
    this._rtcEngine.on('video_input_changed', (data) => {
      this.emitThalEvents('video_input_changed', data)
    })
    // 音频输出设备变化回调
    this._rtcEngine.on('audio_output_changed', (data) => {
      this.emitThalEvents('audio_output_changed', data)
    })
    // 当前用户网络上下行质量评分
    this._rtcEngine.on('network_score', (data) => {
      this.emitThalEvents('network_score', data)
    })
    // 房间内成员说话音量回调
    this._rtcEngine.on('audio_level_report', (data) => {
      this.emitThalEvents('audio_level_report', data)
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
