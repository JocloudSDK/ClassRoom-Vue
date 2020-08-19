import {
  LogLevelEx,
  ExceptionNotDone
} from '@/common/const'

class LogEx {
  constructor (prop) {
    this.ErrorCode = {
      LogLevelIsNotNumber: 10001
    }
    this.DefaultLogLevel = LogLevelEx.Verbose

    this._level = this.DefaultLogLevel
    this._prefix = ''

    // if (prop && prop.hasOwnProperty('logLevel')) {
    //   this.logLevel = prop.logLevel
    // }
    // if (prop && prop.hasOwnProperty('logPrefix')) {
    //   this.prefix = prop.logPrefix
    // }
  }

  checkLogLevel (level) {
    if (undefined === level) return

    if (typeof (level) !== 'number') {
      return {
        code: this.ErrorCode.LogLevelIsNotNumber,
        message: 'Invalid log level!'
      }
    }
  }

  get logLevel () {
    return this._level
  }

  set logLevel (level) {
    this.checkLogLevel(level)
    this._level = level
  }

  get prefix () {
    return this._prefix
  }

  set prefix (value) {
    this._prefix = value
  }

  logLevelToText (logLevel) {
    switch (logLevel) {
      case LogLevelEx.Verbose:
        return 'Verbose'
      case LogLevelEx.Debug:
        return 'Debug'
      case LogLevelEx.Info:
        return 'Info'
      case LogLevelEx.Warn:
        return 'Warn'
      case LogLevelEx.Error:
        return 'Error'
      case LogLevelEx.Crash:
        return 'Crash'
      default:
        return logLevel
    }
  }

  formatDate (date) {
    return date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDay() + '-' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds() + '.' +
        date.getMilliseconds()
  }

  formatNow () {
    return this.formatDate(new Date())
  }

  formatText (text, args) {
    if (!args || args.length === 0) {
      return text
    }

    for (const arg of args) {
      text += typeof arg === 'object' ? JSON.stringify(arg) : arg
    }

    return text
  }

  // this is a very important method, which let us have the ability to change log format for each content.
  format (level, content, args) {
    let text = '[level] time content'

    text = this._prefix + text
    text = text.replace('level', this.logLevelToText(level))
    text = text.replace('time', this.formatNow())
    text = text.replace('content', this.formatText(content, args))

    return text
  }

  write (line) {
    throw (ExceptionNotDone)
  }

  log (level, content, args) {
    if (level < this._level) return
    const line = this.format(level, content, args)
    this.write(line)
  }

  debug (content, ...args) {
    this.log(LogLevelEx.Debug, content, args)
  }

  info (content, ...args) {
    this.log(LogLevelEx.Info, content, args)
  }

  warn (content, ...args) {
    this.log(LogLevelEx.Warn, content, args)
  }

  error (content, ...args) {
    this.log(LogLevelEx.Error, content, args)
  }

  crash (content, ...args) {
    this.log(LogLevelEx.Crash, content, args)
  }
}

export default LogEx
