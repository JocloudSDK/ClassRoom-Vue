import LogC from './logConsole'
import LogLocalFile from './logLocalFile'

class LogFactory {
  New (type, prop) {
    if (!type) {
      return new LogC(prop)
    }

    if ('LocalFile'.toLowerCase() === type.toLowerCase()) {
      return new LogLocalFile(prop)
    }
    if ('Console'.toLowerCase() === type.toLowerCase()) {
      return new LogC(prop)
    } else {
      return new LogC(prop)
    }
  }
}

export default LogFactory
