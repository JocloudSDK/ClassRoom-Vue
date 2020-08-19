export const STORAGE = {
  KEY_TOKEN: 'tb_token',
  KEY_UID: 'user_uid',
  KEY_LANGUAGE: 'language',
  KEY_RTM: 'hummer',
  MAX_AGE: 1000 * 60 * 60 * 24
}

export const ADDRESS = 'www.jocloud.com'

export const THEME = '#547eef'

export const LANGUAGE_TYPE = {
  ZH: '简体中文',
  CN: 'English(United States)'
}

export const VIDEO_PUBLISH_MODE = 101

export const PPT = [
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_01.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_01_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_02.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_02_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_03.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_03_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_04.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_04_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_05.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_05_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_06.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_06_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_07.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_07_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_08.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_08_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_09.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_09_thumb.png'
  },
  {
    url: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_10.png',
    thumbUrl: 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_10_thumb.png'
  }
]

export const WARM_AUDIO = 'https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/1931.mp3'

export const REQUEST_URL = {
  API: 'http://testtoken.hummer.yy.com/',
  FEEDBACK: 'https://imobfeedback.yy.com/',
  NETLESS: 'https://cloudcapiv4.herewhite.com/'
}

export const ExceptionNotDone = {
  code: 1001,
  message: 'Function is not implemented!'
}

export const LogLevelEx = {
  // Will show all logs
  Verbose: 0,

  // Will show logs that level >= Debug(1)
  Debug: 1,

  // Will show logs that level >= Info(10)
  Info: 10,

  // Will show logs that level >= Warn(20)
  Warn: 20,

  // Will show logs that level >= Error(30)
  Error: 30,

  // Will show logs that marks crash.
  Crash: 100
}

export const DIVIDINGRULE = Object.freeze([
  0.10737418240000011,
  0.13421772800000012,
  0.16777216000000014,
  0.20971520000000016,
  0.26214400000000015,
  0.3276800000000002,
  0.4096000000000002,
  0.5120000000000001,
  0.6400000000000001,
  0.8,
  1,
  1.26,
  1.5876000000000001,
  2.000376,
  2.5204737600000002,
  3.1757969376000004,
  4.001504141376,
  5.041895218133761,
  6.352787974848539,
  8.00451284830916,
  10])
