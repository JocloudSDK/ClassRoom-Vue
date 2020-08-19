import {
  extend
} from 'lodash'

const _originStorage = function () {
  // originStorage
  return (function () {
    window.sessionStorage.setItem('__test__', 1)
    window.sessionStorage.getItem('__test__')
    window.sessionStorage.removeItem('__test__')

    return {
      get: function (key) {
        return window.sessionStorage.getItem(key)
      },
      set: function (key, value) {
        return window.sessionStorage.setItem(key, value)
      },
      clear: function () {
        return window.sessionStorage.clear()
      },
      remove: function (key) {
        return window.sessionStorage.removeItem(key)
      }
    }
  })()
}

// export default () => {
const _sessionStorage = function () {
  const originStorage = _originStorage()

  this.defaultOption = {
    maxAge: 0 // ms
  }

  this.get = function (k) {
    var self = this
    var a = originStorage.get(k)
    var _return
    try {
      var json = JSON.parse(a)
      var expiresTimestamp = json.e
      if (expiresTimestamp && Date.now() > expiresTimestamp) {
        _return = undefined
        self.remove(k)
      } else {
        _return = json.a
      }
    } catch (e) {
      _return = undefined
    }
    return _return
  }

  this.set = function (k, v, option) {
    option = extend(true, extend({}, this.defaultOption), option)
    var o = {
      a: v,
      e: option.maxAge > 0 ? (Date.now() + option.maxAge) : 0
    }
    originStorage.set(k, typeof o === 'string' ? o : JSON.stringify(o))
  }

  this.clear = function () {
    return originStorage.clear()
  }

  this.remove = function (k) {
    return originStorage.remove(k)
  }
}

export default new _sessionStorage()
