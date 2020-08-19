import {
  language
} from '@/common/i18n'
import {
  STORAGE
} from '@/common/const'
export default {
  data () {
    return {
      lang: null
    }
  },
  created () {
    window.t = this
    this.initLanguage()
    console.log('this lang', this.lang)
  },
  watch: {
    '$store.state.global.lang' (v) {
      this.initLanguage()
    }
  },
  methods: {
    initLanguage () {
      const l = this.$storage.get(STORAGE.KEY_LANGUAGE) || this.$store.state.global.lang
      this.$store.commit('GLOBAL_LANGUAGE', l)
      if (l) {
        this.lang = language(l)
      } else {
        this.lang = language()
      }
    },
    validator (parent, prop = [], type) {
      let value = null
      const key = value ? 'checkErrorValue' : 'checkValue'
      parent.$children.map(child => {
        if (child.$el.className === 'el-form-item custom-form') {
          if (child.prop && child[key]) {
            if (value) {
              child[key]()
            } else {
              value = child[key]()
            }
          }
        }
      })
      return value
    }
  }
}
