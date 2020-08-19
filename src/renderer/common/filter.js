import {
  isNull
} from 'lodash'

export default {
  install (Vue, options) {
    Vue.filter('isNull', (value, str) => {
      return isNull(value) ? '-' : (str || value)
    })
  }
}
