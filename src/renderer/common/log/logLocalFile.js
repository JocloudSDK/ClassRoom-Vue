import LogEx from './logEx'
const fs = window.require('fs')
const path = window.require('path')
const { app } = window.require('electron').remote

class LogLocalFile extends LogEx {
  constructor (props) {
    super(props)

    this._path = app.getPath('userData')

    this._dirName = this._path + path.sep + 'logs'

    this._fileName = 'electron.log'

    this._fullName = ''

    if (props.logDirName) {
      this._dirName = props.logDirName
    }
    if (props.logFileName) {
      this._fileName = props.logFileName
    }

    this._fullName = this._combine(this._dirName, this._fileName)

    this._mkdir(this._dirName)
  }

  _mkdir (dirName) {
    fs.mkdirSync(dirName, { recursive: true }, (err) => {
      if (err) throw err
    })
  }

  _combine (dir, fileName) {
    return dir && fileName
      ? (dir +
          ((dir.endsWith('/') || dir.endsWith('\\') || fileName.startsWith('/') || fileName.startsWith('\\'))
            ? ''
            : '/') + fileName)
      : ''
  }

  get logFileNameFull () {
    return this._fullName
  }

  // todo: use cache to enhance performance.
  write (line) {
    fs.appendFile(this._fullName, '\n' + line, function (err) {
      if (err) {
        console.log('Write log failed: ' + JSON.stringify(err))
        console.log('Failed log: ' + line)
      }
    })
  }
}

export default LogLocalFile
