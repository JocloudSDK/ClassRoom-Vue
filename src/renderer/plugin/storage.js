import storage from '@/common/storage'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Vue.storage = storage

  Object.defineProperties(Vue.prototype, {
    $storage: {
      get () {
        return storage
      }
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
