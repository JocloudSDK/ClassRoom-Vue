import LogEx from './logEx'

class LogConsole extends LogEx {
  write (line) {
    console.log(line)
  }
}

export default LogConsole
