/* jshint esversion: 6 */
import Events from 'events'
import ThunderBoltEngine from 'thunderbolt-electron-sdk'
// const ThunderBoltEngine = window.thunderBoltEngine
import LogFactory from '@/common/log'
export class ElectronThunderManager {
  constructor () {
    this._event = new Events.EventEmitter()
    this._rtcEngine = new ThunderBoltEngine()
    this._initialize = false
    this._joined = null
    this._log = new LogFactory().New('localFile', {
      logFileName: 'ClassRoom-PC.log',
      logPrefix: '--- App: '
    })
  }

  // 初始化
  initialize (appId, sceneId) {
    console.log('[TB] initialize appId: ', appId, ' sceneId: ', sceneId)
    if (this._initialize === true) {
      return -1
    }
    const res = this._rtcEngine.initialize(appId, sceneId)
    if (res === 0) {
      this._initialize = true
    }
    this.bindThunderEvent()
    this._log.info('[TB] initialize', res)
    return res
  }

  // 设置SDK输出log文件的目录
  setLogFilePath (filePath) {
    console.log('[TB] setLogFilePath')
    this._rtcEngine.setLogFilePath(filePath)
  }

  // 销毁SDK
  destroyEngine () {
    console.log('[TB] destroyEngine')
    this._recEngine.destroyEngine()
    this._initialize = false
  }

  // 设置区域
  setArea (area) {
    console.log('[TB] setArea area: ', area)
    const res = this._rtcEngine.setArea(area)
    return res
  }

  // 设置媒体模式
  setMediaMode (mode) {
    console.log('[TB] setMediaMode mode: ', mode)
    const res = this._rtcEngine.setMediaMode(mode)
    return res
  }

  // 设置房间模式
  setRoomMode (mode) {
    console.log('[TB] setRoomMode mode: ', mode)
    const res = this._rtcEngine.setRoomMode(mode)
    return res
  }

  // 加入房间
  joinRoom ({ token, roomName, uid }) {
    console.log('[TB] joinRoom roomName: ', roomName, ' uid: ', uid, !this.roomName || !uid || this._joined)
    // if (!this.roomName || !uid || this._joined) {
    //   return -1
    // }
    const res = this._rtcEngine.joinRoom(token, roomName, uid)
    if (res === 0) {
      this._joined = true
    }
    console.log('[TB] joinRoom res: ', res)
    this._log.info('[TB] joinRoom res:', res)
    return res
  }

  // 离开房间
  leaveRoom () {
    console.log('[TB] leaveRoom')
    const res = this._rtcEngine.leaveRoom()
    this._log.info('[TB] leaveRoom res:', res)
    this._joined = false
    return res
  }

  // 设置音频参数和使用场景
  setAudioConfig (profile, commutMode, senarioMode) {
    console.log('[TB] setAudioConfig profile: ', profile, ' commutMode: ', commutMode, ' senarioMode: ', senarioMode)
    const res = this._rtcEngine.setAudioConfig(profile, commutMode, senarioMode)
    this._log.info('[TB] setAudioConfig res:', res)
    return res
  }

  // 设置麦克风音量
  adjustRecordingSignalVolume (volume) {
    console.log('调用了adjustRecordingSignalVolume方法')
    const res = this._rtcEngine.adjustRecordingSignalVolume(volume)
    return res
  }

  // 开关本地音频流
  stopLocalAudioStream (stop) {
    const res = this._rtcEngine.stopLocalAudioStream(stop)
    console.log('[TB] stopLocalAudioStream status: ', res)
    this._log.info('[TB] stopLocalAudioStream res:', res)
    return res
  }

  // 关闭/开启声卡采集
  enableLoopbackRecording (enable) {
    console.log('[TB] enableLoopbackRecording enable: ', enable)
    const res = this._rtcEngine.enableLoopbackRecording(enable)
    this._log.info('[TB] enableLoopbackRecording res:', res)
    return res
  }

  // 设置视频呢编码
  setVideoEncoderConfig (config) {
    console.log('[TB] setVideoEncoderConfig config: ', config)
    const res = this._rtcEngine.setVideoEncoderConfig(config)
    this._log.info('[TB] setVideoEncoderConfig res:', res)
    return res
  }

  // 设置视频预览
  setPreviewCanvas (view, mode) {
    console.log('[TB] setPreviewCanvas')
    const res = this._rtcEngine.setPreviewCanvas(view, mode)
    this._log.info('[TB] setPreviewCanvas res:', res)
    return res
  }

  // 取消设置预览视图
  cancelPreviewCanvas () {
    console.log('[TB] cancelPreviewCanvas')
    const res = this._rtcEngine.cancelPreviewCanvas()
    this._log.info('[TB] cancelPreviewCanvas res:', res)
    return res
  }

  // 开启视频预览
  startVideoPreview () {
    console.log('[TB] startVideoPreview')
    const res = this._rtcEngine.startVideoPreview()
    this._log.info('[TB] startVideoPreview res:', res)
    return res
  }

  // 关闭视频预览
  stopVideoPreview () {
    console.log('[TB] stopVideoPreview')
    const res = this._rtcEngine.stopVideoPreview()
    this._log.info('[TB] stopVideoPreview res:', res)
    return res
  }

  // 设置远端视图显示模式
  setPreviewCanvasScaleMode (mode) {
    console.log('[TB] setPreviewCanvasScaleMode mode: ', mode)
    const res = this._rtcEngine.setPreviewCanvasScaleMode(mode)
    this._log.info('[TB] setPreviewCanvasScaleMode res:', res)
    return res
  }

  // 设置本地视频镜像模式
  setLocalVideoMirrorMode (mode) {
    console.log('[TB] setLocalVideoMirrorMode mode: ', mode)
    const res = this._rtcEngine.setLocalVideoMirrorMode(mode)
    this._log.info('[TB] setLocalVideoMirrorMode res:', res)
    return res
  }

  // 开启/关闭视频发送
  stopLocalVideoStream (stop) {
    const res = this._rtcEngine.stopLocalVideoStream(stop)
    console.log('[TB] stopLocalVideoStream status: ', res)
    this._log.info('[TB] stopLocalVideoStream res:', res)
    return res
  }

  // 获取视频参数
  getVideoEncoderParam (config) {
    const res = this._rtcEngine.getVideoEncoderParam(config)
    this._log.info('[TB] getVideoEncoderParam res:', res)
    return res
  }

  // 设置本地视图显示模式
  setCanvasScaleMode (uid, mode) {
    const res = this._rtcEngine.setCanvasScaleMode(uid, mode)
    console.log('[TB] setCanvasScaleMode status: ', res)
    this._log.info('[TB] setCanvasScaleMode res:', res)
    return res
  }

  // 设置远端视频的渲染视图
  setVideoCanvas (uid, view, mode) {
    console.log('[TB] setVideoCanvas')
    const res = this._rtcEngine.setVideoCanvas(uid, view, mode)
    this._log.info('[TB] setVideoCanvas res:', res)
    return res
  }

  // 取消设置视图
  cancelVideoCanvas (uid) {
    console.log('[TB] cancelVideoCanvas')
    const res = this._rtcEngine.cancelVideoCanvas(uid)
    this._log.info('[TB] cancelVideoCanvas res:', res)
    return res
  }

  // 枚举音频输入设备
  enumAudioInputDevices () {
    console.log('[TB] enumAudioInputDevice')
    const res = this._rtcEngine.enumAudioInputDevices()
    this._log.info('[TB] enumAudioInputDevice res:', res)
    return res
  }

  // 设置音频输入设备
  setAudioInputtingDevice (id) {
    console.log('[TB] setAudioInputtingDevice')
    const res = this._rtcEngine.setAudioInputtingDevice(id)
    this._log.info('[TB] setAudioInputtingDevice res:', res)
    return res
  }

  // 获取当前选择输入的设备
  getAudioInputtingDevice () {
    console.log('[TB] getAudioInputtingDevice')
    const res = this._rtcEngine.getAudioInputtingDevice()
    this._log.info('[TB] getAudioInputtingDevice res:', res)
    return res
  }

  // 枚举音频播放设备
  enumAudioOutputDevices () {
    console.log('[TB] enumAudioOutputDevices')
    const res = this._rtcEngine.enumAudioOutputDevices()
    this._log.info('[TB] enumAudioOutputDevices res:', res)
    return res
  }

  // 指定音频播放设备
  setAudioOutputtingDevice (id) {
    console.log('[TB] setAudioOutputtingDevice')
    const res = this._rtcEngine.setAudioOutputtingDevice(id)
    this._log.info('[TB] setAudioOutputtingDevice res:', res)
    return res
  }

  // 获取当前音频播放设备
  getAudioOutputtingDevice () {
    console.log('[TB] getAudioOutputtingDevice')
    const res = this._rtcEngine.getAudioOutputtingDevice()
    this._log.info('[TB] getAudioOutputtingDevice res:', res)
    return res
  }

  // 枚举视频输入设备
  enumVideoDevices () {
    console.log('[TB] enumVideoDevices')
    const res = this._rtcEngine.enumVideoDevices()
    this._log.info('[TB] enumVideoDevices res:', res)
    return res
  }

  // 启动当前音频输入设备测试
  startAudioInputDeviceTest (indicationInterval) {
    console.log('[TB] startAudioInputDeviceTest')
    const res = this._rtcEngine.startAudioInputDeviceTest(indicationInterval)
    this._log.info('[TB] startAudioInputDeviceTest res:', res)
    return res
  }

  // 停止当前音频输入设备测试
  stopAudioInputDeviceTest () {
    console.log('[TB] stopAudioInputDeviceTest')
    const res = this._rtcEngine.stopAudioInputDeviceTest()
    this._log.info('[TB] stopAudioInputDeviceTest res:', res)
    return res
  }

  // 启动当前音频输入设备测试
  startAudioOutputDeviceTest (audioFileName, indicationInterval) {
    console.log('[TB] startAudioOutputDeviceTest')
    const res = this._rtcEngine.startAudioOutputDeviceTest(audioFileName, indicationInterval)
    this._log.info('[TB] startAudioOutputDeviceTest res:', res)
    return res
  }

  // 停止当前播放设备测试
  stopAudioOutputDeviceTest () {
    console.log('[TB] stopAudioOutputDeviceTest')
    const res = this._rtcEngine.stopAudioOutputDeviceTest()
    this._log.info('[TB] stopAudioOutputDeviceTest res:', res)
    return res
  }

  // 打开视频输入设备并启动采集
  startVideoDeviceCapture (index) {
    console.log('[TB] startVideoDeviceCapture')
    const res = this._rtcEngine.startVideoDeviceCapture(index)
    this._log.info('[TB] startVideoDeviceCapture res:', res)
    return res
  }

  // 停止视频设备的采集
  stopVideoDeviceCapture () {
    console.log('[TB] stopVideoDeviceCapture')
    const res = this._rtcEngine.stopVideoDeviceCapture()
    this._log.info('[TB] stopVideoDeviceCapture res:', res)
    return res
  }

  // 打开指定文件
  openAudioPlayer (fileName) {
    const res = this._rtcEngine.openAudioPlayer(fileName)
    console.log('[TB] openAudioPlayer status: ', res)
    this._log.info('[TB] openAudioPlayer res:', res)
    return res
  }

  // 打开播放文件
  startAudioPlayer () {
    const res = this._rtcEngine.startAudioPlayer()
    console.log('[TB] startAudioPlayer status: ', res)
    this._log.info('[TB] startAudioPlayer res:', res)
    return res
  }

  // 设置播放循环
  setAudioPlayerLooping (number) {
    console.log('[TB] setAudioPlayerLooping')
    const res = this._rtcEngine.setAudioPlayerLooping(number)
    this._log.info('[TB] setAudioPlayerLooping res:', res)
    return res
  }

  // 停止播放音乐
  stopAudioPlayer () {
    const res = this._rtcEngine.stopAudioPlayer()
    console.log('[TB] stopAudioPlayer status: ', res)
    this._log.info('[TB] stopAudioPlayer res:', res)
    return res
  }

  // 打开/关闭本地采集音量回调
  enableCaptureVolumeIndication (interval, moreThanThd, lessThanThd, smooth) {
    console.log('[TB] enableCaptureVolumeIndication')
    const res = this._rtcEngine.enableCaptureVolumeIndication(interval, moreThanThd, lessThanThd, smooth)
    this._log.info('[TB] enableCaptureVolumeIndication res:', res)
    return res
  }

  // 打开/关闭说话者音量回调
  setAudioVolumeIndication (interval, smooth) {
    console.log('[TB] setAudioVolumeIndication')
    const res = this._rtcEngine.setAudioVolumeIndication(interval, smooth)
    this._log.info('[TB] setAudioVolumeIndication res:', res)
    return res
  }

  /**
   * 设置音频开播类型
   * THUNDER_AUDIO_MIC = 0,          // 仅麦克风
   * THUNDER_AUDIO_FILE = 1,         // 仅文件
   * THUNDER_AUDIO_MIX = 2,          // 麦克风和文件
   * THUNDER_AUDIO_TYPE_NONE = 10,   // 停止所有音频数据上行
   */
  setAudioSourceType (sourceType) {
    console.log('[TB] setAudioSourceType', sourceType)
    const res = this._rtcEngine.setAudioSourceType(sourceType)
    this._log.info('[TB] setAudioSourceType res:', res)
    return res
  }

  // 开启视频采集设备测试
  startVideoDeviceTest (index, view) {
    console.log('[TB] startVideoDeviceTest')
    const res = this._rtcEngine.startVideoDeviceTest(index, view)
    this._log.info('[TB] startVideoDeviceTest res:', res)
    return res
  }

  // 停止视频采集设备测试
  stopVideoDeviceTest () {
    console.log('[TB] stopVideoDeviceTest')
    const res = this._rtcEngine.stopVideoDeviceTest()
    this._log.info('[TB] stopVideoDeviceTest res:', res)
    return res
  }

  bindThunderEvent () {
    var self = this
    // 进房间成功回调
    this._rtcEngine.on('onJoinRoomSuccess', (roomName, uid, elapsed) => {
      console.log('[TB] onJoinRoomSuccess roomId:', roomName, ' uid:', uid)
      this.emitThalEvents('onJoinRoomSuccess', roomName, uid, elapsed)
    })
    // 离开房间回调
    this._rtcEngine.on('onLeaveRoom', () => {
      console.log('[TB] onLeaveRoom')
      self._joined = false
      this.emitThalEvents('onLeaveRoom')
    })
    // 远端音频流变化回调
    this._rtcEngine.on('onRemoteAudioStopped', (uid, stop) => {
      console.log('[TB] onRemoteAudioStopped')
      this.emitThalEvents('onRemoteAudioStopped', uid, stop)
    })
    // 远端视频流变化回调
    this._rtcEngine.on('onRemoteVideoStopped', (uid, stop) => {
      console.log('[TB] onRemoteVideoStopped')
      this.emitThalEvents('onRemoteVideoStopped', { uid, stop })
    })
    // 设备采集音量回调
    this._rtcEngine.on('onCaptureVolumeIndication', (totalVolume, cpt, micVolume) => {
      console.log('[TB] onCaptureVolumeIndication')
      this.emitThalEvents('onCaptureVolumeIndication', totalVolume, cpt, micVolume)
    })
    // 当前房间内说话者音量回调
    this._rtcEngine.on('onPlayVolumeIndication', (speakers, totalVolume) => {
      this.emitThalEvents('onPlayVolumeIndication', { speakers, totalVolume })
    })
    // 用户的网络上下行质量报告
    this._rtcEngine.on('onNetworkQuality', (uid, txQuality, rxQuality) => {
      console.log('[TB] onNetworkQuality uid:', uid, ' txQuality: ', txQuality, ' rxQuality', rxQuality)
      this.emitThalEvents('onNetworkQuality', { uid, txQuality, rxQuality })
    })
    // 试音输入音量回
    this._rtcEngine.on('onInputVolume', volume => {
      console.log('[TB] onInputVolume uid:', volume)
      this.emitThalEvents('onInputVolume', volume)
    })
    // this._rtcEngine.on('onRoomStats', stats => {
    //   console.log('[TB] onRoomStats', stats)
    //   this.emitThalEvents('onRoomStats', stats)
    // })
  }

  off (eventName, ...args) {
    this._event.removeListener(eventName, ...args)
  }

  offAll () {
    this._event.removeAllListeners()
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
